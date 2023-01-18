/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import onChange from 'on-change';
import render from './render';

const validateUrl = (url, feeds) => {
  const schema = yup
    .string()
    .url()
    .notOneOf(feeds);

  return schema
    .validate(url)
    .catch((error) => {
      throw error;
    });
};

const app = (initState, i18next) => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
  };

  const watchedState = onChange(initState, (path, value) => {
    render(initState, i18next, elements, path, value);
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = elements.input;
    validateUrl(value, initState.feeds)
      .then((url) => {
        // watchedState.form.valid = 'valid';
        watchedState.feeds.push(url);
      })
      .catch((error) => {
        // watchedState.form.valid = 'invalid';
        watchedState.errorMsgFeedback = error.message;
      });
  });
};

export default app;
