import { AssetFileFormat, AssetType, Status, type AssetPublicAPI } from '$lib/api/DBTypes';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
    /*let asset = await fetch(`https://api.modelsaber.com/assets/${params.id}`, {
      credentials: 'include',
    });
    if (!asset.ok) {
        throw new Error(`Asset with ID ${params.id} not found`);
    }
    let assetData = await asset.json();
    */
    // Simulating asset data for demonstration purposes
    let dummyAssetData: AssetPublicAPI = {
      id: parseInt(params.id),
      name: `Asset ${params.id}`,
      oldId: null,
      linkedIds: [],
      type: AssetType.ChromaEnvironment,
      fileFormat: AssetFileFormat.JSON,
      author: {
        id: 'user123',
        username: `user${params.id}`,
        displayName: `User ${params.id}`,
        bio: null,
        sponsorUrl: null,
        roles: [],
        avatarUrl: null
      },
      description: '',
      tags: [`test`, `asset`, `example`],
      license: '',
      licenseUrl: null,
      sourceUrl: null,
      fileHash: '',
      fileSize: 0,
      status: Status.Private,
      statusHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return {
      pageMetadata: {
        //title: `${assetData.title || `404`} - ModelSaber`,
        //description: assetData.description,
      },
      data: dummyAssetData,
    };
}) satisfies PageLoad;