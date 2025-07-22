import { User } from "@lucide/svelte";
import type { LayoutLoad } from "./$types";
import { UserRole } from "$lib/scripts/api/DBTypes";

export const load: LayoutLoad = async () => {
  let demoUser = {
      id: "gay",
      username: "guest",
      displayName: "John Model",
      bio: null,
      sponsorUrl: null,
      roles: [UserRole.Trusted],
      avatarUrl: `/modelsaber-logo-web.svg`
    }
  return {
    user: demoUser || undefined,
  }
}