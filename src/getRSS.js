import axios from 'axios';

const buildPath = (urlBuildPath) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', urlBuildPath);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};

const getRSS = (urlGetRSS) => {
  const proxyURL = buildPath(urlGetRSS);
  return axios.get(proxyURL);
};

export default getRSS;
