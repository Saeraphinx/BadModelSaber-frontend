import { env } from "$env/dynamic/public";

export function getApiUrl(path: string): string {
  return `${env.PUBLIC_API_URL}${path}`;
}

export function getAssetUrl(fileName: string): string {
  return `${env.PUBLIC_ASSET_URL}/uploads/${fileName}`;
}

export function getAssetThumbnailUrl(fileName: string): string {
  return `${env.PUBLIC_ASSET_URL}/icons/${fileName}`;
}
type SuccessResponse<T> = {
  response: Response;
  message: string;
  data: T;
  status: number;
  isError: false;
}
type CustomFetchResponse<T> = Promise<SuccessResponse<T> | {
  response: null;
  message: string;
  data: null;
  status: number;
  isError: true;
}>

export async function fetchApiSafe<T>(path: string, options?: RequestInit, customFetch = globalThis.fetch): CustomFetchResponse<T> {
  return fetchApi<T>(path, options, customFetch).catch((error) => {
    console.error(`Error fetching ${path}:`, error);
    return {
      response: null,
      message: error.message || "Unknown error",
      data: null,
      status: 500,
      isError: true as true,
    };
  });
}

export async function fetchApi<T>(path: string, options?: RequestInit, customFetch = globalThis.fetch): Promise<SuccessResponse<T>> {
  if (!env.PUBLIC_API_URL) {
    throw new Error("PUBLIC_API_URL is not defined in environment variables.");
  }
  const url = getApiUrl(path);
  return customFetch(url, {
    ...options,
    method: options?.method || "GET",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": `BadModelSaber-frontend/${env.PUBLIC_VERSION}`,
      ...options?.headers,
    },
  }).then(async (response) => {
    if (!response.ok) {
      return response.json().then((error: {message: string}) => {
        throw new Error(`Error fetching ${path}: ${error.message}`);
      }).catch((error) => {
        throw new Error(`Error parsing JSON from ${url}: ${error.message}`);
      });
    }
    let message = response.statusText || "Success";
    let data = null;
    if (response.status !== 204) {
      data = await response.json().catch((error) => {
        throw new Error(`Error parsing JSON from ${url}: ${error.message}`);
      });
      if (data && typeof data === 'object' && `message` in data) {
        message = data.message || message;
      }
    }
    return {
      response: response,
      message: message,
      data: data,
      status: response.status,
      isError: false as false,
    }
  }).catch((error) => {
    console.error(`Error fetching ${url}:`, error)
    throw error
  });
}