import axios from 'axios';

const buildPath = (url) => {
  console.log('buildPath', url);
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};

const getRSS = (url) => {
  console.log('getRSS', url);
  const proxyURL = buildPath(url);
  console.log('proxyURL', proxyURL);
  return axios.get(proxyURL);
};

export default getRSS;
