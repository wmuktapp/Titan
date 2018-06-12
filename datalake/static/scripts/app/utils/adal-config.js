
import { AuthenticationContext, adalFetch, withAdalLogin } from 'react-adal';

export const adalConfig = window.adalConfig;

export const authContext = new AuthenticationContext(adalConfig);

export const adalApiFetch = (fetch, url, options) =>
  adalFetch(authContext, adalConfig.endpoints.api, fetch, url, options);

export const withAdalLoginApi = withAdalLogin(authContext, adalConfig.endpoints.api);
