
import { AuthenticationContext, adalFetch, runWithAdal, withAdalLogin } from 'react-adal';

export const useAdal = !!window.adalConfig.clientId;

export const adalConfig = window.adalConfig;

export const authContext = useAdal ? new AuthenticationContext(adalConfig) : {};

export const adalApiFetch = (fetch, url, options) =>
  useAdal
    ? adalFetch(authContext, adalConfig.endpoints.api, fetch, url, options)
    : fetch(url, options);

export const withAdalLoginApi = withAdalLogin(authContext, adalConfig.endpoints.api);

export const wrapWithAdal = app =>
  useAdal
    ? runWithAdal(authContext, app)
    : app();
