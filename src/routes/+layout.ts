import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async () => {
  let demoUser = {
      id: "gay",
      username: "guest",
      displayName: "John Model",
      bio: null,
      sponsorUrl: null,
      roles: [],
      avatarUrl: `/modelsaber-logo-web.svg`
    }
  return {
    user: demoUser || undefined,
  }
}