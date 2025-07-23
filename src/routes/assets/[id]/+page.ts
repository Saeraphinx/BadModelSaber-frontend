import { AssetFileFormat, AssetType, LinkedAssetLinkType, Status, type AssetPublicAPIv3 } from '$lib/scripts/api/DBTypes';
import { fetchApi } from '$lib/scripts/utils/api';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
    let asset = await fetchApi(`/assets/${params.id}`, {
        method: 'GET',
        credentials: 'include',
    }, fetch);
    if (asset.isError) {
        console.error(`Failed to fetch asset with ID ${params.id}:`, asset.message);
        console.log(asset);
        throw new Error(`Asset with ID ${params.id} not found`);
    }
    let assetData = await asset.data as AssetPublicAPIv3;

    return {
      pageMetadata: {
        title: `${assetData.name || `Error`} - ModelSaber`,
        description: assetData.description,
      },
      pageData: assetData,
    };
}) satisfies PageLoad;