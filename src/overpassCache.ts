import {
  OSM_COPYRIGHT_URL,
  OVERPASS_ENDPOINT,
  serializeBbox,
  validateResponse,
  type Bbox,
  type CachedResponse,
  type OverpassResponse,
  type SourceMetadata,
} from "./overpass";

export const OVERPASS_CACHE_DB_NAME = "ChartTheCourse";
export const OVERPASS_CACHE_STORE_NAME = "courseGeometry";
export const OVERPASS_CACHE_SCHEMA_VERSION = 1;
export const OVERPASS_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const MAX_OVERPASS_CACHE_RECORD_BYTES = 1_048_576;
export const ODBL_CACHE_LICENSE = "ODbL-1.0";

export type OverpassCacheMode = "discovery" | "detail";

export type OverpassCacheRecord = {
  schemaVersion: 1;
  key: string;
  mode: OverpassCacheMode;
  storedAt: number;
  expiresAt: number;
  rawResponse: string;
  source: SourceMetadata;
  license: typeof ODBL_CACHE_LICENSE;
  sizeBytes: number;
};

export type CacheLookup =
  | { kind: "hit"; cached: CachedResponse; response: OverpassResponse; record: OverpassCacheRecord }
  | { kind: "stale"; cached: CachedResponse; response: OverpassResponse; record: OverpassCacheRecord }
  | { kind: "miss" }
  | { kind: "warning"; message: string };

export type CacheWriteResult = { kind: "stored" } | { kind: "warning"; message: string };

type CacheReadOptions = {
  key: string;
  mode: OverpassCacheMode;
  query: string;
  bbox: Bbox;
  now?: number;
  signal?: AbortSignal;
};

type CacheWriteOptions = {
  key: string;
  mode: OverpassCacheMode;
  cached: CachedResponse;
  now?: number;
  signal?: AbortSignal;
};

type ValidationResult =
  | { ok: true; freshness: "fresh" | "stale"; response: OverpassResponse }
  | { ok: false; reason: "invalid" | "expired" | "oversized" | "aborted" };

function abortError(): DOMException {
  return new DOMException("Operation aborted.", "AbortError");
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw abortError();
}

function utf8Bytes(value: string): number {
  return new TextEncoder().encode(value).length;
}

function finiteInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && Number.isInteger(value);
}

function normalizeRecordForSize(record: OverpassCacheRecord): OverpassCacheRecord {
  return {
    schemaVersion: OVERPASS_CACHE_SCHEMA_VERSION,
    key: record.key,
    mode: record.mode,
    storedAt: record.storedAt,
    expiresAt: record.expiresAt,
    rawResponse: record.rawResponse,
    source: {
      query: record.source.query,
      endpoint: record.source.endpoint,
      completedAt: record.source.completedAt,
      bbox: record.source.bbox,
      copyrightUrl: record.source.copyrightUrl,
    },
    license: ODBL_CACHE_LICENSE,
    sizeBytes: 0,
  };
}

export function recordSizeBytes(record: OverpassCacheRecord): number {
  return utf8Bytes(JSON.stringify(normalizeRecordForSize(record)));
}

export function createOverpassCacheRecord(
  key: string,
  mode: OverpassCacheMode,
  cached: CachedResponse,
  storedAt = Date.now(),
): OverpassCacheRecord | { kind: "oversized"; sizeBytes: number } {
  const record: OverpassCacheRecord = {
    schemaVersion: OVERPASS_CACHE_SCHEMA_VERSION,
    key,
    mode,
    storedAt,
    expiresAt: storedAt + OVERPASS_CACHE_TTL_MS,
    rawResponse: cached.rawResponse,
    source: cached.source,
    license: ODBL_CACHE_LICENSE,
    sizeBytes: 0,
  };
  const sizeBytes = recordSizeBytes(record);
  if (sizeBytes > MAX_OVERPASS_CACHE_RECORD_BYTES) return { kind: "oversized", sizeBytes };
  return { ...record, sizeBytes };
}

function sourceMatches(source: SourceMetadata, query: string, bbox: Bbox): boolean {
  return source.query === query
    && source.endpoint === OVERPASS_ENDPOINT
    && source.bbox === serializeBbox(bbox)
    && source.copyrightUrl === OSM_COPYRIGHT_URL
    && typeof source.completedAt === "string"
    && Number.isFinite(Date.parse(source.completedAt));
}

export function validateOverpassCacheRecord(
  value: unknown,
  options: Required<Pick<CacheReadOptions, "key" | "mode" | "query" | "bbox" | "now">>,
): ValidationResult {
  if (!value || typeof value !== "object") return { ok: false, reason: "invalid" };
  const record = value as Partial<OverpassCacheRecord>;
  if (record.schemaVersion !== OVERPASS_CACHE_SCHEMA_VERSION) return { ok: false, reason: "invalid" };
  if (record.key !== options.key || record.mode !== options.mode) return { ok: false, reason: "invalid" };
  if (!record.source || typeof record.rawResponse !== "string" || record.rawResponse.trim() === "") {
    return { ok: false, reason: "invalid" };
  }
  if (!sourceMatches(record.source, options.query, options.bbox)) return { ok: false, reason: "invalid" };
  if (record.license !== ODBL_CACHE_LICENSE) return { ok: false, reason: "invalid" };
  if (!finiteInteger(record.storedAt) || !finiteInteger(record.expiresAt) || !finiteInteger(record.sizeBytes)) {
    return { ok: false, reason: "invalid" };
  }
  if (record.storedAt > options.now) return { ok: false, reason: "invalid" };
  if (record.expiresAt !== record.storedAt + OVERPASS_CACHE_TTL_MS) return { ok: false, reason: "invalid" };
  if (record.sizeBytes > MAX_OVERPASS_CACHE_RECORD_BYTES) return { ok: false, reason: "oversized" };
  if (recordSizeBytes(record as OverpassCacheRecord) !== record.sizeBytes) return { ok: false, reason: "invalid" };

  let parsed: unknown;
  try {
    parsed = JSON.parse(record.rawResponse);
  } catch {
    return { ok: false, reason: "invalid" };
  }
  const response = validateResponse(parsed);
  if (!response) return { ok: false, reason: "invalid" };
  return {
    ok: true,
    freshness: options.now >= record.expiresAt ? "stale" : "fresh",
    response,
  };
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed."));
  });
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction aborted."));
    transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed."));
  });
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(OVERPASS_CACHE_DB_NAME, OVERPASS_CACHE_SCHEMA_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(OVERPASS_CACHE_STORE_NAME)) {
        db.createObjectStore(OVERPASS_CACHE_STORE_NAME, { keyPath: "key" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB open failed."));
    request.onblocked = () => reject(new Error("IndexedDB open was blocked by another tab."));
  });
}

export class OverpassCache {
  private dbPromise: Promise<IDBDatabase | null> | null = null;
  private memory = new Map<string, OverpassCacheRecord>();
  private degraded = false;
  private warning = "";

  async read(options: CacheReadOptions): Promise<CacheLookup> {
    try {
      throwIfAborted(options.signal);
      const now = options.now ?? Date.now();
      const record = await this.readRecord(options.key);
      throwIfAborted(options.signal);
      if (!record) return { kind: "miss" };
      const validation = validateOverpassCacheRecord(record, {
        key: options.key,
        mode: options.mode,
        query: options.query,
        bbox: options.bbox,
        now,
      });
      if (!validation.ok) {
        if (validation.reason !== "aborted") void this.delete(options.key);
        return { kind: "miss" };
      }
      const cached = { rawResponse: record.rawResponse, source: record.source };
      return validation.freshness === "fresh"
        ? { kind: "hit", cached, response: validation.response, record }
        : { kind: "stale", cached, response: validation.response, record };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") throw error;
      return { kind: "warning", message: this.message(error, "Durable cache is unavailable; using live course data when possible.") };
    }
  }

  async write(options: CacheWriteOptions): Promise<CacheWriteResult> {
    try {
      throwIfAborted(options.signal);
      const record = createOverpassCacheRecord(options.key, options.mode, options.cached, options.now);
      if ("kind" in record) {
        return { kind: "warning", message: "Course data loaded, but the response is too large for durable cache and is available only for this session." };
      }
      await this.writeRecord(record);
      throwIfAborted(options.signal);
      if (this.degraded) {
        return { kind: "warning", message: this.message(null, "Course data loaded, but durable cache is unavailable; using non-durable memory cache for this session.") };
      }
      return { kind: "stored" };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") throw error;
      this.degrade(error);
      const record = createOverpassCacheRecord(options.key, options.mode, options.cached, options.now);
      if (!("kind" in record)) this.memory.set(options.key, record);
      return { kind: "warning", message: this.message(error, "Course data loaded, but durable cache could not be updated.") };
    }
  }

  async delete(key: string): Promise<void> {
    try {
      this.memory.delete(key);
      const db = await this.database();
      if (!db) return;
      const transaction = db.transaction(OVERPASS_CACHE_STORE_NAME, "readwrite");
      transaction.objectStore(OVERPASS_CACHE_STORE_NAME).delete(key);
      await transactionDone(transaction);
    } catch {
      // Best-effort cleanup only. Deletion failure must never turn a miss into a hit.
    }
  }

  resetMemory() {
    this.memory.clear();
  }

  private async readRecord(key: string): Promise<OverpassCacheRecord | null> {
    if (this.degraded) return this.memory.get(key) ?? null;
    const db = await this.database();
    if (!db) return this.memory.get(key) ?? null;
    const transaction = db.transaction(OVERPASS_CACHE_STORE_NAME, "readonly");
    const result = await requestToPromise<OverpassCacheRecord | undefined>(
      transaction.objectStore(OVERPASS_CACHE_STORE_NAME).get(key),
    );
    return result ?? null;
  }

  private async writeRecord(record: OverpassCacheRecord): Promise<void> {
    if (this.degraded) {
      this.memory.set(record.key, record);
      return;
    }
    const db = await this.database();
    if (!db) {
      this.memory.set(record.key, record);
      return;
    }
    const transaction = db.transaction(OVERPASS_CACHE_STORE_NAME, "readwrite");
    transaction.objectStore(OVERPASS_CACHE_STORE_NAME).put(record);
    await transactionDone(transaction);
  }

  private async database(): Promise<IDBDatabase | null> {
    if (typeof indexedDB === "undefined" || this.degraded) return null;
    if (!this.dbPromise) {
      this.dbPromise = openDatabase()
        .then((db) => {
          db.onversionchange = () => {
            db.close();
            this.degraded = true;
            this.warning = "Durable cache was closed for an upgrade; using non-durable memory cache for this session.";
          };
          return db;
        })
        .catch((error) => {
          this.degrade(error);
          return null;
        });
    }
    return this.dbPromise;
  }

  private degrade(error: unknown) {
    this.degraded = true;
    this.warning = this.message(error, "Durable cache is unavailable; using non-durable memory cache for this session.");
  }

  private message(error: unknown, fallback: string): string {
    return this.warning || (error instanceof Error && error.message ? `${fallback} ${error.message}` : fallback);
  }
}

export const overpassCache = new OverpassCache();
