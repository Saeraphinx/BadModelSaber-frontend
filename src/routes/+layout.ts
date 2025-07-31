import { User } from "@lucide/svelte";
import type { LayoutLoad } from "./$types";
import { type AlertPublicAPIv3, type AssetRequestPublicAPIv3, type UserPublicAPIv3, UserRole } from "$lib/scripts/api/DBTypes";
import { fetchApiSafe } from "$lib/scripts/utils/api";
import { toast } from "svelte-sonner";

export const load: LayoutLoad = async ({ fetch }) => {
  let pendingToasts: Awaited<ReturnType<LayoutLoad>>['pendingToasts'] = [];
  let userToasted = false;
  let alertsToasted = false;
  let userRes = await fetchApiSafe<UserPublicAPIv3>("/users/me", {
    method: "GET",
    credentials: "include",
  }, fetch).catch((error) => {
    console.error(`Failed to fetch user data:`, error)
    userToasted = true;
    pendingToasts.push({
      type: 'error',
      title: `Unable to fetch user data`,
      description: `Error: ${error.message}`,
    });
    return {
      response: null,
      message: "Failed to fetch user data",
      data: null,
      status: 500,
      isError: true,
    };
  });

  let alertRes = await fetchApiSafe<AlertPublicAPIv3[]>("/alerts", {
    method: "GET",
    credentials: "include",
  }, fetch).catch((error) => {
    console.error(`Failed to fetch alerts:`, error)
    alertsToasted = true;
    pendingToasts.push({
      type: 'error',
      title: `Unable to fetch alerts`,
      description: `Error: ${error.message}`,
    });
    return {
      response: null,
      message: "Failed to fetch alerts",
      data: null,
      status: 500,
      isError: true,
    };
  });

  let requestRes = await fetchApiSafe<AssetRequestPublicAPIv3[]>("/requests?myIncoming=true&myOutgoing=true", {
    method: "GET",
    credentials: "include",
  }, fetch).catch((error) => {
    console.error(`Failed to fetch requests:`, error);
    return {
      response: null,
      message: "Failed to fetch requests: " + error.message,
      data: null,
      status: 500,
      isError: true,
    };
  });

  if (userRes.isError) {
    if (userRes.status !== 404) {
      console.error(`Failed to fetch user data:`, userRes.message);
      userToasted ? pendingToasts.push({
        type: 'error',
        title: `Unable to fetch user data`,
        description: `Error: ${userRes.message}`,
      }) : null;
      return {
        fetch,
        alerts: [],
        requests: {
          incoming: [],
          outgoing: [],
        },
        user: undefined,
      }
    }
    return {
      fetch,
      alerts: [],
      requests: {
        incoming: [],
        outgoing: [],
      },
      user: undefined,
    }
  }

  if (alertRes.isError && !alertsToasted) {
    console.error(`Failed to fetch alerts:`, alertRes.message);
    pendingToasts.push({
      type: 'error',
      title: `Unable to fetch alerts. Please try again later.`,
      description: `Error: ${alertRes.message}`,
    });
  }

  let incoming: AssetRequestPublicAPIv3[] = [];
  let outgoing: AssetRequestPublicAPIv3[] = [];
  if (requestRes.isError) {
    console.error(`Failed to fetch requests:`, requestRes.message);
    pendingToasts.push({
      type: 'error',
      title: `Unable to fetch requests. Please try again later.`,
      description: `Error: ${requestRes.message}`,
    });
  } else {
    if (requestRes.data) {
      for (const request of requestRes.data) {
        if (request.requesterId === userRes.data?.id) {
          outgoing.push(request);
        }
        if (request.requestResponseBy === userRes.data?.id) {
          incoming.push(request);
        }
      }
    }
  }

  return {
      fetch,
      pendingToasts: pendingToasts,
      requests: {
        incoming: incoming,
        outgoing: outgoing,
      },
      user: userRes.data,
      alerts: alertRes.isError ? [] : (alertRes.data || []),
    }
}