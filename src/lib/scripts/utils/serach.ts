import type { AssetPublicAPI } from "../api/DBTypes";
import { Index } from "flexsearch";

export function generateAssetSearchEngine(assets: AssetPublicAPI[]) {
  const searchEngine = new Index({
    tokenize: "reverse"
  })

  let returnMap = new Map<number, AssetPublicAPI>();

  assets.forEach((asset) => {
    returnMap.set(asset.id, asset);
    searchEngine.add(asset.id, `${asset.name} ${asset.description} ${asset.author} ${asset.tags.join(" ")}`);
  });

  return {
    assets: returnMap,
    searchEngine: searchEngine,
    search: (query: string) => {
      return searchEngine.search(query).map((result) => {
        return returnMap.get(parseInt(result.toString()));
      }).filter((asset) => asset !== undefined);
    }
  }
}