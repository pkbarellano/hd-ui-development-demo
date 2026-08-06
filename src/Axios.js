import axios from 'axios';

// const newCancelToken = axios.CancelToken.source();

const instance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 1000,
    // cancelToken: newCancelToken.token,
    headers: {
        'X-HD-Key': 'bd8c3f81-24da-4fa8-a6c1-2f6f47360b8f'
    }
});

export default instance;