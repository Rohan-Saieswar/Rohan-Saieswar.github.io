import { connect as connectNet, type Socket as NetSocket } from "node:net";
import { connect as connectTls, type TLSSocket } from "node:tls";

type MusicProvider = "spotify" | "apple" | "lastfm" | "music" | "unknown";
type RespValue = string | number | null | RespValue[];
type RedisSocket = NetSocket | TLSSocket;

interface NowPlayingRecord {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumArt?: string;
  url?: string;
  provider: MusicProvider;
  app?: string;
  source?: string;
  progressMs?: number;
  durationMs?: number;
  capturedAt: string;
}

interface IncomingNowPlayingPayload {
  isPlaying?: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumArt?: string;
  url?: string;
  provider?: string;
  app?: string;
  source?: string;
  progressMs?: number;
  durationMs?: number;
  capturedAt?: string;
  ttlSeconds?: number;
}

const NOW_PLAYING_KEY = "music:now-playing";
const DEFAULT_TTL_SECONDS = 180;
const MAX_TTL_SECONDS = 60 * 60 * 24;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Now-Playing-Token",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...corsHeaders,
      ...(init.headers ?? {}),
    },
  });
}

function normalizeProvider(value?: string): MusicProvider {
  switch (value?.trim().toLowerCase()) {
    case "spotify":
      return "spotify";
    case "apple":
    case "applemusic":
    case "apple-music":
    case "apple music":
    case "itunes":
      return "apple";
    case "lastfm":
    case "last.fm":
      return "lastfm";
    case "music":
    case "musicapp":
      return "music";
    default:
      return value ? "unknown" : "unknown";
  }
}

function sanitizeOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function sanitizeOptionalNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function clampTtl(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_TTL_SECONDS;
  }

  return Math.max(1, Math.min(MAX_TTL_SECONDS, Math.floor(value)));
}

function serializeRedisCommand(command: Array<string | number>) {
  const parts = command.map((part) => {
    const value = String(part);
    return Buffer.from(`$${Buffer.byteLength(value, "utf8")}\r\n${value}\r\n`, "utf8");
  });

  return Buffer.concat([
    Buffer.from(`*${command.length}\r\n`, "utf8"),
    ...parts,
  ]);
}

function findCrlf(buffer: Buffer, startIndex = 0) {
  for (let index = startIndex; index < buffer.length - 1; index += 1) {
    if (buffer[index] === 13 && buffer[index + 1] === 10) {
      return index;
    }
  }

  return -1;
}

function parseRespValue(buffer: Buffer, offset = 0): { value: RespValue; bytesRead: number } | null {
  if (buffer.length <= offset) {
    return null;
  }

  const prefix = String.fromCharCode(buffer[offset]);
  const lineEnd = findCrlf(buffer, offset + 1);
  if (lineEnd === -1) {
    return null;
  }

  const line = buffer.toString("utf8", offset + 1, lineEnd);
  const headerBytes = lineEnd - offset + 2;

  if (prefix === "+") {
    return { value: line, bytesRead: headerBytes };
  }

  if (prefix === "-") {
    throw new Error(line);
  }

  if (prefix === ":") {
    return { value: Number(line), bytesRead: headerBytes };
  }

  if (prefix === "$") {
    const length = Number(line);
    if (length === -1) {
      return { value: null, bytesRead: headerBytes };
    }

    const dataStart = lineEnd + 2;
    const dataEnd = dataStart + length;
    if (buffer.length < dataEnd + 2) {
      return null;
    }

    return {
      value: buffer.toString("utf8", dataStart, dataEnd),
      bytesRead: dataEnd - offset + 2,
    };
  }

  if (prefix === "*") {
    const itemCount = Number(line);
    if (itemCount === -1) {
      return { value: null, bytesRead: headerBytes };
    }

    const values: RespValue[] = [];
    let cursor = offset + headerBytes;

    for (let index = 0; index < itemCount; index += 1) {
      const parsed = parseRespValue(buffer, cursor);
      if (!parsed) {
        return null;
      }

      values.push(parsed.value);
      cursor += parsed.bytesRead;
    }

    return {
      value: values,
      bytesRead: cursor - offset,
    };
  }

  throw new Error(`Unsupported Redis response prefix: ${prefix}`);
}

function waitForSocketChunk(socket: RedisSocket) {
  return new Promise<Buffer>((resolve, reject) => {
    const onData = (chunk: Buffer | string) => {
      cleanup();
      resolve(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    };
    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };
    const onClose = () => {
      cleanup();
      reject(new Error("Redis socket closed before a response was received."));
    };

    const cleanup = () => {
      socket.off("data", onData);
      socket.off("error", onError);
      socket.off("close", onClose);
    };

    socket.on("data", onData);
    socket.on("error", onError);
    socket.on("close", onClose);
  });
}

async function readRedisResponse(socket: RedisSocket, state: { buffer: Buffer }) {
  while (true) {
    const parsed = parseRespValue(state.buffer);
    if (parsed) {
      state.buffer = state.buffer.subarray(parsed.bytesRead);
      return parsed.value;
    }

    const chunk = await waitForSocketChunk(socket);
    state.buffer = Buffer.concat([state.buffer, chunk]);
  }
}

async function connectRedisSocket(redisUrl: string) {
  const parsedUrl = new URL(redisUrl);
  const port = parsedUrl.port ? Number(parsedUrl.port) : parsedUrl.protocol === "rediss:" ? 6380 : 6379;
  const usesTls = parsedUrl.protocol === "rediss:";
  const socket = usesTls
    ? connectTls({
        host: parsedUrl.hostname,
        port,
        servername: parsedUrl.hostname,
      })
    : connectNet({
        host: parsedUrl.hostname,
        port,
      });

  socket.setNoDelay(true);
  await new Promise<void>((resolve, reject) => {
    const readyEvent = usesTls ? "secureConnect" : "connect";
    const onReady = () => {
      cleanup();
      resolve();
    };
    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };

    const cleanup = () => {
      socket.off(readyEvent, onReady);
      socket.off("error", onError);
    };

    socket.on(readyEvent, onReady);
    socket.on("error", onError);
  });

  return {
    socket,
    username: decodeURIComponent(parsedUrl.username || ""),
    password: decodeURIComponent(parsedUrl.password || ""),
    dbIndex: parsedUrl.pathname && parsedUrl.pathname !== "/" ? Number(parsedUrl.pathname.slice(1)) : undefined,
    state: { buffer: Buffer.alloc(0) },
  };
}

async function runRedisUrlCommand<T>(command: Array<string | number>): Promise<T | null> {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error("Missing REDIS_URL environment variable.");
  }

  const connection = await connectRedisSocket(redisUrl);

  async function send(parts: Array<string | number>) {
    connection.socket.write(serializeRedisCommand(parts));
    return readRedisResponse(connection.socket, connection.state);
  }

  try {
    if (connection.password) {
      if (connection.username) {
        await send(["AUTH", connection.username, connection.password]);
      } else {
        await send(["AUTH", connection.password]);
      }
    }

    if (typeof connection.dbIndex === "number" && Number.isFinite(connection.dbIndex)) {
      await send(["SELECT", connection.dbIndex]);
    }

    return (await send(command)) as T | null;
  } finally {
    connection.socket.end();
  }
}

async function runRedisRestCommand<T>(command: unknown[]): Promise<T | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error("Missing Upstash Redis environment variables.");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  const data = (await response.json()) as { result?: T | null; error?: string };
  if (!response.ok || data.error) {
    throw new Error(data.error || `Redis request failed with status ${response.status}.`);
  }

  return (data.result ?? null) as T | null;
}

async function readNowPlayingRecord() {
  const rawValue = process.env.REDIS_URL
    ? await runRedisUrlCommand<string | null>(["GET", NOW_PLAYING_KEY])
    : await runRedisRestCommand<string | null>(["GET", NOW_PLAYING_KEY]);

  if (!rawValue) {
    return null;
  }

  return JSON.parse(rawValue) as NowPlayingRecord;
}

async function writeNowPlayingRecord(record: NowPlayingRecord, ttlSeconds: number) {
  if (process.env.REDIS_URL) {
    await runRedisUrlCommand(["SET", NOW_PLAYING_KEY, JSON.stringify(record), "EX", ttlSeconds]);
    return;
  }

  await runRedisRestCommand(["SET", NOW_PLAYING_KEY, JSON.stringify(record), "EX", ttlSeconds]);
}

function isAuthorized(request: Request) {
  const expectedToken = process.env.NOW_PLAYING_WRITE_TOKEN;
  if (!expectedToken) {
    return false;
  }

  const bearerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  const headerToken = request.headers.get("x-now-playing-token")?.trim();
  return bearerToken === expectedToken || headerToken === expectedToken;
}

function buildRecord(payload: IncomingNowPlayingPayload): NowPlayingRecord {
  return {
    isPlaying: Boolean(payload.isPlaying),
    title: sanitizeOptionalString(payload.title),
    artist: sanitizeOptionalString(payload.artist),
    album: sanitizeOptionalString(payload.album),
    albumArt: sanitizeOptionalString(payload.albumArt),
    url: sanitizeOptionalString(payload.url),
    provider: normalizeProvider(payload.provider),
    app: sanitizeOptionalString(payload.app),
    source: sanitizeOptionalString(payload.source),
    progressMs: sanitizeOptionalNumber(payload.progressMs),
    durationMs: sanitizeOptionalNumber(payload.durationMs),
    capturedAt: sanitizeOptionalString(payload.capturedAt) || new Date().toISOString(),
  };
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    const record = await readNowPlayingRecord();

    if (!record) {
      return jsonResponse({ isPlaying: false, provider: "unknown" as const });
    }

    return jsonResponse(record);
  } catch (error) {
    console.error("Failed to read now playing state", error);
    return jsonResponse(
      { error: "Failed to read now playing state." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return jsonResponse({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as IncomingNowPlayingPayload;
    const record = buildRecord(payload);
    const ttlSeconds = clampTtl(payload.ttlSeconds);

    await writeNowPlayingRecord(record, ttlSeconds);

    return jsonResponse({
      ok: true,
      expiresIn: ttlSeconds,
      record,
    });
  } catch (error) {
    console.error("Failed to write now playing state", error);
    return jsonResponse(
      { error: "Failed to write now playing state." },
      { status: 400 },
    );
  }
}
