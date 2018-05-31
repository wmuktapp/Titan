
function getAccessToken() {
    return authorisation.accessToken;
}

const Ajax = {

    fetch(url, options) {

        // Default request options
        const defaults = {
            headers: {
                'Authorization': 'Bearer ' + getAccessToken()
            }
        };

        // Merge objects
        Object.assign(options, defaults);

        return window.fetch(url, options);
    }

};

export default Ajax;
