import axios from 'axios';
import queryString from 'query-string';
import {API_URL, ACCESS_TOKEN_KEY} from "../constants";

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: params => queryString.stringify(params),
});
//add token to header
axiosClient.interceptors.request.use(async (config) => {
  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY)
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
})
axiosClient.interceptors.response.use((response) => {
  if (response && response.data) {
    if (response.data) {
      return response.data;
    }
    return response;
  }
  return response;
}, (error) => {
  const errorMessage = "Something went wrong";
  if (error.response.data) {
    throw {...error.response.data};
  } else {
    throw {...error, message: errorMessage};
  }

});
export default axiosClient;
