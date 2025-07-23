import { User } from "@lucide/svelte";
import type { LayoutLoad } from "./$types";
import { type UserPublicAPIv3, UserRole } from "$lib/scripts/api/DBTypes";
import { fetchApi } from "$lib/scripts/utils/api";
import { toast } from "svelte-sonner";

export const load: LayoutLoad = async ({ fetch }) => {
  let userRes = await fetchApi<UserPublicAPIv3>("/users/me", {
    method: "GET",
    credentials: "include",
  }, fetch).catch((error) => {
    console.error(`Failed to fetch user data:`, error)
    toast.error(`Unable to fetch user data. Please try logging in again.`, {
      description: `Error: ${error.message}`,
    });
    return {
      response: new Response(undefined, { status: 500 }),
      message: "Failed to fetch user data",
      data: null,
      status: 500,
      isError: true,
    };
  });

  let alertRes = await fetchApi("/alerts", {
    method: "GET",
    credentials: "include",
  }, fetch).catch((error) => {
    console.error(`Failed to fetch alerts:`, error)
    toast.error(`Unable to fetch alerts. Please try again later.`, {
      description: `Error: ${error.message}`,
    });
    return {
      response: new Response(undefined, { status: 500 }),
      message: "Failed to fetch alerts",
      data: null,
      status: 500,
      isError: true,
    };
  });

  if (userRes.isError) {
    if (userRes.status !== 404) {
      console.error(`Failed to fetch user data:`, userRes.message);
      toast.info(`Unable to fetch user data. Please try logging in again.`, {
        description: `Error: ${userRes.message}`,
        icon: User,
      });
      return {
        fetch,
        user: undefined,
      }
    }
    return {
      fetch,
      user: undefined,
    }
  }

  if (alertRes.isError) {
    console.error(`Failed to fetch alerts:`, alertRes.message);
    toast.error(`Unable to fetch alerts. Please try again later.`, {
      description: `Error: ${alertRes.message}`,
    });
  }

  return {
      fetch,
      user: userRes.data,
      alerts: alertRes.isError ? [] : alertRes.data,
    }
}