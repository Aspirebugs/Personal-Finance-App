import axios from 'axios';
const backend_url = 'http://localhost:8080';
export default axios.create({
    baseURL : backend_url
});

export const axiosPrivate = axios.create({
    baseURL : backend_url,
    headers : { 'Content-Type' : 'application/json' },
    withCredentials : true
});