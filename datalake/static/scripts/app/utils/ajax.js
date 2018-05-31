
// TODO
function getAccessToken() {
    return '3268756328756732';
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
