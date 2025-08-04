import { type AssetRequestPublicAPIv3, type AssetFileFormat, RequestType } from "$lib/scripts/api/DBTypes";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { fetchApi, fetchApiSafe } from "$lib/scripts/utils/api";

export const load: PageLoad = async ({ params, fetch }) => {
  return {
    pageData: {
        id: parseInt(params.id, 10),
        refrencedAssetId: 1, // Placeholder, should be replaced with actual asset ID
        requesterId: "5", // Placeholder, should be replaced with actual requester ID
        requestResponseBy: null,
        requestType: RequestType.Report, // Placeholder, should be replaced with actual request type
        accepted: null,
        messages: [{
          message: "This is a test message",
          userId: "5", // Placeholder, should be replaced with actual author ID
          timestamp: new Date(),
        }],
        resolvedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } satisfies AssetRequestPublicAPIv3,
  }

  let data = await fetchApi<AssetRequestPublicAPIv3>(`/requests/${params.id}`, {}, fetch).then(res => {
    return res.data;
  }).catch(err => {
    if (err.status === 404) {
      throw error(404, {
        message: err.message,
        redirectToHome: true,
      });
    } else if (err.status === 403) {
      throw error(403, {
        message: err.message,
        redirectToHome: true,
      });
    } else {
      throw error(500, {
        message: "An unexpected error occurred while fetching the request.",
        additionalInfo: "See logs for more info."
      });
    }
  });

  return {
    pageData: data,
    pageMetadata: {
      title: `Request ${params.id} - ModelSaber`,
    },
  };
};