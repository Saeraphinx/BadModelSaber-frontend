import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async () => {
  return {
    user: {
      id: "gay",
      username: "guest",
      displayName: "John Model",
      bio: null,
      sponsorUrl: null,
      roles: [],
      avatarUrl: `/static/modelsaber-logo-web.svg`
    }
  }
}