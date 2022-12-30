import axios, { AxiosInstance } from 'axios';
const clienteHttp: AxiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_URL
});

export default clienteHttp;