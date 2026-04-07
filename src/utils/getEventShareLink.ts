const PROD_APP_URL = "https://sviato.vercel.app";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const getAppBaseUrl = () => {
  const envBaseUrl = import.meta.env.VITE_PUBLIC_APP_URL?.trim();

  if (typeof window === "undefined") {
    return trimTrailingSlash(envBaseUrl || PROD_APP_URL);
  }

  const { origin, hostname } = window.location;
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

  return trimTrailingSlash(isLocalhost ? envBaseUrl || PROD_APP_URL : origin);
};

export const getEventShareLink = (eventId: string) =>
  `${getAppBaseUrl()}/event/${eventId}`;
