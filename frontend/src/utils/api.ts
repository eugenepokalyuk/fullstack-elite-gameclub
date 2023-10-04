import data from './ping.json'


const ApiUrlPath = 'https://localhost:3001';
// const ApiUrlPath = 'https://norma.nomoreparties.space/api';

const request = (endpoint: string, options: RequestInit) => {
    const url = `${ApiUrlPath}${endpoint}`;
    return fetch(url, options).then(checkResponse);
}
const checkResponse = (res: Response) => {
    return res.ok ? res.json() : res.json().then((err) => Promise.reject(err));
};
export const fetchComputersData = () => {
    const endpoint = '/ingredients';
    // return request(endpoint, {})
    //     .then((res) => {
    //         if (res.success) return res.data;
    //         return Promise.reject(res);
    //     });

    // mock data
    return data;
}