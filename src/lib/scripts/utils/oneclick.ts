import type { AssetPublicAPIv3 } from "../api/DBTypes";

export function generateOneClickUrl(asset: AssetPublicAPIv3): string {
  const baseUrl = "modelsaber://";
  let modelType: string;
  switch (asset.fileFormat) {
    case `avatar_avatar`:
      modelType = "avatar";
      break;
    case `saber_saber`:
      modelType = "saber";
      break;
    case `platform_plat`:
      modelType = "platform";
      break;
    case `note_bloq`:
      modelType = "bloq";
    default:
      modelType = asset.fileFormat
      break;
  }

  return `${baseUrl}${modelType}/${asset.id}/tbd`;
}