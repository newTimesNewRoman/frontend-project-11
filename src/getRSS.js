import axios from 'axios';

const buildPath = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};

export default (url) => {
  const proxyURL = buildPath(url);
  return axios.get(proxyURL);
};
