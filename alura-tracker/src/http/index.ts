import axios, { AxiosInstance } from 'axios';

const clienteHttp: AxiosInstance = axios.create({
    baseURL: process.env.API_URL
});


export default clienteHttp;