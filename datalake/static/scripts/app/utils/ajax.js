
function getAccessToken() {
    return authorisation.accessToken;
}

const Ajax = {

    fetch(url, method, body) {

        return window.fetch(url, {
            method: method || 'GET',
            headers: {
                'Authorization': 'Bearer ' + getAccessToken()
            }
        });
    }

};

export default Ajax;
