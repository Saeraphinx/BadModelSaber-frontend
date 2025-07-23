import { AssetFileFormat } from "../api/DBTypes";

export function stylizeAssetType(type: AssetFileFormat): string {
  switch (type) {
    case AssetFileFormat.Camera2Config_JSON:
      return ".json (Camera2)";
    case AssetFileFormat.ChromaEnv_JSON:
      return ".json (Chroma)";
    case AssetFileFormat.CountersPlusConfig_JSON:
      return ".json (Counters+)";
    case AssetFileFormat.HSVConfig_JSON:
      return ".json (HSV)";
    default:
      return `.${type.split('_')[1]}`;  // Default case for other formats
  }
}