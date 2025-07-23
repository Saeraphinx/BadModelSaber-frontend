import { AssetFileFormat, AssetType, LinkedAssetLinkType, Status, type UserPublicAPIv3 } from '$lib/scripts/api/DBTypes';
import { fetchApi } from '$lib/scripts/utils/api';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
    let user = await fetchApi(`/users/${params.id}`, {
        method: 'GET',
        credentials: 'include',
    }, fetch);
    if (user.isError) {
        console.error(`Failed to fetch user with ID ${params.id}:`, user.message);
        console.log(user);
        throw new Error(`user with ID ${params.id} not found`);
    }
    let userData = await user.data as UserPublicAPIv3;

    return {
      pageMetadata: {
        title: `${userData.displayName || `Error`} - ModelSaber`,
        description: userData.bio,
      },
      pageData: userData,
    };
}) satisfies PageLoad;