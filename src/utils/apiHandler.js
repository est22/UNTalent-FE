import { createQueryString } from './queryParams';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const RESUME_BASE_URL = process.env.REACT_APP_RESUME_API_BASE_URL;

const createUrl = (endpoint, params) => {
  const queryString = createQueryString(params);
  const normalizedEndpoint = endpoint.endsWith('/') ? endpoint : `${endpoint}/`;
  const targetBaseUrl = endpoint.startsWith('/resume/') ? RESUME_BASE_URL : BASE_URL;
  if (!targetBaseUrl) {
    console.error(`Error: Base URL is not defined for endpoint: ${endpoint}. Check .env file.`);
    return null;
  }
  return `${targetBaseUrl}${normalizedEndpoint}${queryString}`;
};

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

const authOptions = {
  credentials: 'include',
  mode: 'cors',
};

export const callApi = {
  get: async (endpoint, params = null, needAuth = false) => {
    const url = createUrl(endpoint, params);
    const options = needAuth ? authOptions : {};
    const response = await fetch(url, {
      method: 'GET',
      ...options,
    });
    return handleResponse(response);
  },

  post: async (endpoint, data = null, isFormData = false, needAuth = false) => {
    const url = createUrl(endpoint);
    const headers = isFormData ? {} : defaultHeaders;
    const options = needAuth ? authOptions : {};
    const body = isFormData ? data : JSON.stringify(data);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
      ...options,
    });
    return handleResponse(response);
  },

  put: async (endpoint, data = null, params = null, needAuth = false) => {
    const url = createUrl(endpoint, params);
    const options = needAuth ? authOptions : {};
    const response = await fetch(url, {
      method: 'PUT',
      headers: defaultHeaders,
      body: data ? JSON.stringify(data) : null,
      ...options,
    });
    return handleResponse(response);
  },

  patch: async (endpoint, data = null, params = null, needAuth = false) => {
    const url = createUrl(endpoint, params);
    const options = needAuth ? authOptions : {};
    const response = await fetch(url, {
      method: 'PATCH',
      headers: defaultHeaders,
      body: data ? JSON.stringify(data) : null,
      ...options,
    });
    return handleResponse(response);
  },

  delete: async (endpoint, params = null, needAuth = false) => {
    const url = createUrl(endpoint, params);
    const options = needAuth ? authOptions : {};
    const response = await fetch(url, {
      method: 'DELETE',
      headers: defaultHeaders,
      ...options,
    });
    return handleResponse(response);
  },
};

const handleResponse = async (response) => {
  const responseText = await response.text();

  if (!response.ok) {
    console.error(`API Error: ${response.status} ${response.statusText}`);
    const errorData = JSON.parse(responseText);
    const error = new Error();
    error.data = errorData;
    throw error;
  }

  return responseText ? JSON.parse(responseText) : null;
};
