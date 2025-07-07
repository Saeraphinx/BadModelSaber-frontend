// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { UserPublicAPI } from '$lib/api/DBTypes';
import 'unplugin-icons/types/svelte'

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    interface PageData {
      user?: UserPublicAPI;
      pageMetadata?: {
        title?: string;
      },
      pageData?: any; // This can be used to pass any additional data to the page
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
