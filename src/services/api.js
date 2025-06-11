import { LOGIN_URL, LOGOUT_URL, ALL_DATA_URL } from "../utils/globalConstants";

const getHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token && { Authorization: `Bearer ${token}` }),
});

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Something went wrong");
  }
  return response.json();
};

const BASE_URL = "http://localhost:7000";

export const api = {
  login: async (credentials) => {
    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(credentials),
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  },

  logout: async (token) => {
    try {
      const response = await fetch(LOGOUT_URL, {
        method: "POST",
        headers: getHeaders(token),
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.message || "Logout failed");
    }
  },

  getAllData: async (params, token) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${ALL_DATA_URL}?${queryString}`, {
        method: "GET",
        headers: getHeaders(token),
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.message || "Failed to fetch data");
    }
  },

  get: async (url, token) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(token),
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.message || "Failed to fetch data");
    }
  },

  post: async (url, data, token) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.message || "Failed to submit data");
    }
  },
};
