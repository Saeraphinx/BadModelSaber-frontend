import type { PageLoad } from './$types';

export const load = (async () => {
  return {
    pageMetadata: {
      title: 'Assets - ModelSaber',
    },
  };
}) satisfies PageLoad;