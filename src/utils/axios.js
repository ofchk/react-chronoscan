/**
 * axios setup to use mock service
 */

import axios from 'axios';

const axiosServices = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3010/' });

// interceptor for http
axiosServices.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(error);
        return Promise.reject((error.response && error.response.data) || error.message || 'Wrong Services')
    });

export default axiosServices;
