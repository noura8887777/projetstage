import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
    withXSRFToken: true,
});

api.interceptors.request.use(async request => {
    const isMutation = ['post', 'put', 'patch', 'delete'].includes(request.method.toLowerCase());
    const hasXSRFToken = document.cookie.includes('XSRF-TOKEN');
    const getXSRFToken = async () => await api.get('/sanctum/csrf-cookie', { baseURL: "http://localhost:8000" });
    if (isMutation && !hasXSRFToken) await getXSRFToken()

    return request
});

export default api