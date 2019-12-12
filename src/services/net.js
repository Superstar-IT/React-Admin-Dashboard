// import Session from './Session';


function apiCall(url, params, method = "GET", useAuthentication = false, extraHeaders) {

    let headers = {
        'Accept': 'application/json',
        ...extraHeaders
    };

    if (useAuthentication) {
        headers = {
            ...headers,
            'X-Auth-Token': JSON.parse(localStorage.getItem('user')).api_token
        }
    }

    let options = {
        headers,
        method
    };

    if (method === 'POST') {
        options = {
            ...options,
            body: params
        }
    }

    return new Promise((resolve, reject) => {

        fetch(url, options)
            .then(res => {
                res.json().then(json => {
                    if (!res.ok) {
                        console.log('err401',res.status);
                        if (res.status === 401) {
                            // localStorage.removeItem('user');
                            // history.push('/');
                            console.log('401');
                        }
                        reject(new Error({
                            type: 'server',
                            status: res.status,
                            ...json
                        }));
                    }
                    resolve(json);
                })
                    .catch((err) => {
                        reject(new Error({
                            type: 'json',
                            status: res.status,
                            ...err
                        }));
                    });
            })
            .catch((err) => {
                reject(new Error({
                    type: 'internet',
                    ...err
                }));
            });
    });

}

export function get(url, params, useAuthentication = true, extraHeaders) {
    return apiCall(url, params, 'GET', useAuthentication, extraHeaders);
}

export function post(url, params, useAuthentication = true) {
    return apiCall(url, JSON.stringify(params), 'POST', useAuthentication, {'Content-Type': 'application/json'});
}

export function postForm(url, params, useAuthentication = true) {
    return apiCall(url, params, 'POST', useAuthentication);
}
