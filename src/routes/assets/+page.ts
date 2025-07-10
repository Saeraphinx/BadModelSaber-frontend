import { AssetType } from '$lib/scripts/api/DBTypes';
import type { PageLoad } from './$types';

export const load = (async (data) => {
  let type = data.url.searchParams.get('type') || 'all';
  if ((Object.values(AssetType) as string[]).includes(type)) {
    type = type as AssetType;
  } else {
    type = 'all';
  }

  let typeCapital = type.split(' ').map(str => {
    if (str.length === 0) {
      return ''; // Handle empty strings
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }).join(' ');

  return {
    pageData: {
      type: type
    },
    pageMetadata: {
      title: `${typeCapital === `all` ? `Assets` : typeCapital} - ModelSaber`,
    },
  };
}) satisfies PageLoad;