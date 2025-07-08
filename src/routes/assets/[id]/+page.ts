import { AssetFileFormat, AssetType, LinkedAssetLinkType, Status, type AssetPublicAPI } from '$lib/api/DBTypes';
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
      linkedIds: [{
        id: `2`,
        linkType: LinkedAssetLinkType.Alternate,
      },{
        id: `3`,
        linkType: LinkedAssetLinkType.Alternate,
      },{
        id: `2`,
        linkType: LinkedAssetLinkType.Alternate,
      },{
        id: `3`,
        linkType: LinkedAssetLinkType.Alternate,
      },{
        id: `2`,
        linkType: LinkedAssetLinkType.Alternate,
      },{
        id: `3`,
        linkType: LinkedAssetLinkType.Alternate,
      }],
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
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu pulvinar lectus. Integer sagittis lorem at suscipit lobortis. Praesent vehicula nisi quis nunc volutpat, sed laoreet ex gravida. Ut varius laoreet ipsum, sit amet malesuada mauris tristique a. Donec venenatis consectetur luctus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis libero est, ultricies id quam sed, mattis vulputate nunc. Sed sit amet odio vel nunc scelerisque egestas. Nullam id congue ante. Maecenas convallis odio nisl, in sollicitudin eros lobortis in. Suspendisse tincidunt lacus consequat, ultricies diam nec, tempor felis. Nunc tempor cursus felis nec gravida. Sed eu mauris eu odio pellentesque cursus. ',
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
      pageData: dummyAssetData,
    };
}) satisfies PageLoad;