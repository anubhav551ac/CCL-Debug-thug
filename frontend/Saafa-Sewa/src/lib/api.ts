const BASE_URL = "http://localhost:5000";

type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

export const apiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    // Check if the response is JSON
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        const json: ApiResponse<T> = await res.json();
        if (!json.success) {
            throw new Error(json.error ?? "An unknown error occurred");
        }
        return json.data;
    }

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }

    return (await res.json()) as T;
};

// API client with convenience methods
const api = {
    get: <T,>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
    post: <T,>(endpoint: string, body?: unknown) => apiRequest<T>(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
    put: <T,>(endpoint: string, body?: unknown) => apiRequest<T>(endpoint, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
    delete: <T,>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' }),
};

export default api;
