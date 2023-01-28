import axios from 'axios';

const buildPath = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};

const getRSS = (url) => {
  const proxyURL = buildPath(url);
  return axios.get(proxyURL);
};

export default getRSS;
