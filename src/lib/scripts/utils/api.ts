import { env } from "$env/dynamic/public";

export function getApiUrl(path: string): string {
  return `${env.PUBLIC_API_URL}${path}`;
}

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<{
  response: Response;
  message: string;
  data: T;
  status: number;
  isError: false;
} | {
  response: Response;
  message: string;
  data: any;
  status: number;
  isError: true;
}> {
  const url = getApiUrl(path);
  return fetch(url, {
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
        console.error(`Error fetching ${url}:`, error);
        return {
          response: response,
          message: error.message || "An error occurred",
          data: error,
          status: response.status,
          isError: true,
        };
      }).catch((error) => {
        console.error(`Error parsing JSON from ${url}:`, error);
        return {
          response: response,
          message: "An error occurred while processing the response.",
          data: null,
          status: response.status,
          isError: true,
        };
      });
    }
    return {
      response: response,
      message: response.statusText || "Success",
      data: await response.json(),
      status: 200,
      isError: false,
    }
  }).catch((error) => {
    console.error(`Error fetching ${url}:`, error)
    throw error;
  });
}