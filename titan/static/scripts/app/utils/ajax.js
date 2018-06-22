
import { adalApiFetch } from './adal-config';

function getAccessToken() {
    return authorisation.accessToken;
}

const Ajax = {

    fetch(url, options) {

        // Default request options
        // const requestOptions = {
        //     headers: {
        //         "Authorization": getAccessToken()
        //     }
        // };

        const requestOptions = {};

        // Merge objects
        Object.assign(requestOptions, options);

        // return adalApiFetch(window.fetch, url, requestOptions);
        return window.fetch(url, requestOptions);
    }

};

export default Ajax;
