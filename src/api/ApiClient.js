import axios from "axios";

class ApiClient {
    constructor(token = null) {
        this.client = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL,
            timeout: 10000,
        });

        // Set default Authorization header if token is provided
        if (token) {
            this.setToken(token);
        }
    }

    setToken(token) {
        this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    // HTTP methods

    async get(url, config = {}) {
        return this.client.get(url, config);
    }

    async post(url, data = {}, config = {}) {
        return this.client.post(url, data, config);
    }

    async put(url, data = {}, config = {}) {
        return this.client.put(url, data, config);
    }

    async delete(url, config = {}) {
        return this.client.delete(url, config);
    }

    async patch(url, data = {}, config = {}) {
        return this.client.patch(url, data, config);
    }
}

export default ApiClient;
