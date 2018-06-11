
import { adalApiFetch } from './adal-config';

function getAccessToken() {
    return authorisation.accessToken;
}

const Ajax = {

    fetch(url, options) {

        // Default request options
        const requestOptions = {
            headers: {
                // "Authorization": getAccessToken()
            }
        };

        // Merge objects
        Object.assign(requestOptions, options);

        // adalFetch(this.authContext, this.config.endpoints.api, window.fetch, url, options);

        return adalApiFetch(window.fetch, url, requestOptions);

        // return window.fetch(url, requestOptions);
    }

};

export default Ajax;
