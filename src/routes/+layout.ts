import { User } from "@lucide/svelte";
import type { LayoutLoad } from "./$types";
import { type AlertPublicAPIv3, type UserPublicAPIv3, UserRole } from "$lib/scripts/api/DBTypes";
import { fetchApi } from "$lib/scripts/utils/api";
import { toast } from "svelte-sonner";

export const load: LayoutLoad = async ({ fetch }) => {
  let pendingToasts: Awaited<ReturnType<LayoutLoad>>['pendingToasts'] = [];
  let userToasted = false;
  let alertsToasted = false;
  let userRes = await fetchApi<UserPublicAPIv3>("/users/me", {
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

  let alertRes = await fetchApi<AlertPublicAPIv3[]>("/alerts", {
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
        user: undefined,
      }
    }
    return {
      fetch,
      alerts: [],
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

  return {
      fetch,
      pendingToasts: pendingToasts,
      user: userRes.data,
      alerts: alertRes.isError ? [] : (alertRes.data || []),
    }
}