import axios from "axios";

const HttpBackendClient = axios.create({
    timeout: 600000,
    maxBodyLength: Number.POSITIVE_INFINITY,
    maxContentLength: Number.POSITIVE_INFINITY,
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002/api/v1',
  });

export default HttpBackendClient;