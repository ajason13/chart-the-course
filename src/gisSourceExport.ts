import {
  OSM_COPYRIGHT_URL,
  OVERPASS_ENDPOINT,
  serializeBbox,
  validateResponse,
  type Bbox,
  type SourceMetadata,
} from "./overpass";

export const GIS_SOURCE_EXPORT_VERSION = "1.0.0";
export const GIS_SOURCE_EXPORT_MIME = "application/json;charset=utf-8";
export const GIS_SOURCE_EXPORT_MAX_BYTES = 1_048_576;
export const GIS_SOURCE_EXPORT_LICENSE = "ODbL-1.0";

export type SourceConsentState = "fresh" | "stale-consented";

export type ActiveSourceEvidence = {
  mode: "detail";
  cacheKey: string;
  rawResponse: string;
  source: SourceMetadata;
  consentState: SourceConsentState;
};

export type OsmElementSummary = {
  type: "node" | "way" | "relation";
  id: number;
  tagKeys: string[];
};

export type GisSourceExportEnvelope = {
  bbox: string;
  completedAt: string;
  consentState: SourceConsentState;
  copyrightUrl: typeof OSM_COPYRIGHT_URL;
  endpoint: typeof OVERPASS_ENDPOINT;
  exportVersion: typeof GIS_SOURCE_EXPORT_VERSION;
  exportedAt: string;
  isStaleSource: boolean;
  license: typeof GIS_SOURCE_EXPORT_LICENSE;
  osmElementsSummary: OsmElementSummary[];
  query: string;
  rawResponse: string;
  sourceAgeDays?: number;
};

export type GisSourceExportErrorCode =
  | "MISSING_EVIDENCE"
  | "WRONG_MODE"
  | "SOURCE_MISMATCH"
  | "INVALID_SOURCE"
  | "INVALID_RESPONSE"
  | "OVERSIZED_EXPORT";

export type GisSourceExportResult =
  | { ok: true; envelope: GisSourceExportEnvelope; text: string; filename: string; sizeBytes: number }
  | { ok: false; code: GisSourceExportErrorCode; message: string; sizeBytes?: number };

type ExportContext = {
  query: string;
  bbox: Bbox;
};

const TYPE_ORDER: Record<OsmElementSummary["type"], number> = {
  node: 0,
  relation: 1,
  way: 2,
};

function utf8Bytes(value: string): number {
  return new TextEncoder().encode(value).length;
}

function validDate(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

export function formatGisSourceExportFilename(exportedAt: string): string {
  const compact = exportedAt.replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  return `ctc-gis-source-${compact}.json`;
}

export function extractOsmElementSummary(rawResponse: string): OsmElementSummary[] | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawResponse);
  } catch {
    return null;
  }
  const response = validateResponse(parsed);
  if (!response) return null;
  return response.elements.map((element) => {
    const tags = element.tags && typeof element.tags === "object" && !Array.isArray(element.tags)
      ? Object.keys(element.tags).sort((left, right) => left.localeCompare(right))
      : [];
    return { type: element.type, id: element.id, tagKeys: tags };
  }).sort((left, right) => TYPE_ORDER[left.type] - TYPE_ORDER[right.type] || left.id - right.id);
}

export function serializeGisSourceEnvelope(envelope: GisSourceExportEnvelope): string {
  const ordered = envelope.isStaleSource
    ? {
      bbox: envelope.bbox,
      completedAt: envelope.completedAt,
      consentState: envelope.consentState,
      copyrightUrl: envelope.copyrightUrl,
      endpoint: envelope.endpoint,
      exportVersion: envelope.exportVersion,
      exportedAt: envelope.exportedAt,
      isStaleSource: envelope.isStaleSource,
      license: envelope.license,
      osmElementsSummary: envelope.osmElementsSummary,
      query: envelope.query,
      rawResponse: envelope.rawResponse,
      sourceAgeDays: envelope.sourceAgeDays,
    }
    : {
      bbox: envelope.bbox,
      completedAt: envelope.completedAt,
      consentState: envelope.consentState,
      copyrightUrl: envelope.copyrightUrl,
      endpoint: envelope.endpoint,
      exportVersion: envelope.exportVersion,
      exportedAt: envelope.exportedAt,
      isStaleSource: envelope.isStaleSource,
      license: envelope.license,
      osmElementsSummary: envelope.osmElementsSummary,
      query: envelope.query,
      rawResponse: envelope.rawResponse,
    };
  return `${JSON.stringify(ordered, null, 2)}\n`;
}

export function buildGisSourceExport(
  evidence: ActiveSourceEvidence | null,
  context: ExportContext | null,
  exportedAt = new Date().toISOString(),
): GisSourceExportResult {
  if (!evidence || !context) {
    return { ok: false, code: "MISSING_EVIDENCE", message: "No active detail source data is available for export." };
  }
  if (evidence.mode !== "detail") {
    return { ok: false, code: "WRONG_MODE", message: "Raw GIS source export is available only for loaded course detail data." };
  }
  if (
    evidence.source.query !== context.query
    || evidence.source.bbox !== serializeBbox(context.bbox)
    || evidence.source.endpoint !== OVERPASS_ENDPOINT
    || evidence.source.copyrightUrl !== OSM_COPYRIGHT_URL
  ) {
    return { ok: false, code: "SOURCE_MISMATCH", message: "Source data does not match the active detail view." };
  }
  if (!validDate(evidence.source.completedAt) || !validDate(exportedAt)) {
    return { ok: false, code: "INVALID_SOURCE", message: "Source data has invalid timestamp metadata." };
  }
  const summary = extractOsmElementSummary(evidence.rawResponse);
  if (!summary) {
    return { ok: false, code: "INVALID_RESPONSE", message: "Source data is not valid Overpass JSON." };
  }
  const isStaleSource = evidence.consentState === "stale-consented";
  const envelope: GisSourceExportEnvelope = {
    bbox: evidence.source.bbox,
    completedAt: evidence.source.completedAt,
    consentState: evidence.consentState,
    copyrightUrl: OSM_COPYRIGHT_URL,
    endpoint: OVERPASS_ENDPOINT,
    exportVersion: GIS_SOURCE_EXPORT_VERSION,
    exportedAt,
    isStaleSource,
    license: GIS_SOURCE_EXPORT_LICENSE,
    osmElementsSummary: summary,
    query: evidence.source.query,
    rawResponse: evidence.rawResponse,
  };
  if (isStaleSource) {
    envelope.sourceAgeDays = Math.max(0, Math.floor((Date.parse(exportedAt) - Date.parse(evidence.source.completedAt)) / 86_400_000));
  }
  const text = serializeGisSourceEnvelope(envelope);
  const sizeBytes = utf8Bytes(text);
  if (sizeBytes > GIS_SOURCE_EXPORT_MAX_BYTES) {
    return {
      ok: false,
      code: "OVERSIZED_EXPORT",
      message: "Raw GIS source export exceeds the 1 MiB limit. Refresh with a smaller detail area.",
      sizeBytes,
    };
  }
  return { ok: true, envelope, text, filename: formatGisSourceExportFilename(exportedAt), sizeBytes };
}
