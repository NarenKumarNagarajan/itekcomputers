import { LOGIN_URL, LOGOUT_URL, ALL_DATA_URL } from "../utils/globalConstants";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(
      error.message || "Something went wrong",
      response.status,
    );
  }
  return response.json();
};

const getHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token && { Authorization: `Bearer ${token}` }),
});

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
      throw new ApiError(error.message || "Login failed", error.status);
    }
  },

  logout: async (userData, token) => {
    try {
      const response = await fetch(LOGOUT_URL, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    } catch (error) {
      throw new ApiError(error.message || "Logout failed", error.status);
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
      throw new ApiError(error.message || "Failed to fetch data", error.status);
    }
  },
};
