import axios, { AxiosResponse } from 'axios';

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const apiClient = axios.create({
    baseURL: 'https://petstore.swagger.io/v2',
    headers: {
        'Content-Type': 'application/json',
        'api_key': 'special-key'
    }
});

export default apiClient;
