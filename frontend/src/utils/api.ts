const ApiUrlPath = 'http://localhost:8000';

const request = (endpoint: string, options: any) => {
    const url = `${ApiUrlPath}${endpoint}`;
    return fetch(url, options).then(checkResponse);
};

const checkResponse = (res: Response) => {
    return res.ok
        ? res.json()
        : res.json().then((err) => Promise.reject(err));
};

export const fetchComputersData = async () => {
    const endpoint = "/ping";
    const options = {
        headers: {
            auth: 123
        },
    }
    return request(endpoint, options);
}
export const fetchSetPlay = async () => {
    const endpoint = "/play";
    const options = {
        headers: {
            auth: 123
        },
    }
    return request(endpoint, options);
}