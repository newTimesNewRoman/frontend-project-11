/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import render from './render';
import getRSS from './getRSS';
import parser from './parser';

const validateUrl = (url, feeds, i18next) => {
  yup.setLocale({
    string: {
      url: i18next.t('form.errors.invalidUrl'),
    },
    mixed: {
      required: i18next.t('form.errors.required'),
      notOneOf: i18next.t('form.errors.notUniqueUrl'),
    },
  });

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

const app = (initState, elements, i18next) => {
  const watchedState = render(initState, elements, i18next);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = elements.input;
    watchedState.form.valid = true;
    validateUrl(value, initState.feeds, i18next)
      .then((url) => {
        watchedState.form.error = null;
        watchedState.form.state = 'processing';
        return getRSS(url);
      })
      .then((rss) => {
        const data = parser(rss.data.contents);
        console.log(data);
        watchedState.form.state = 'success';
      })
      .catch((error) => {
        watchedState.form.valid = false;
        if (error.name === 'ValidationError') {
          watchedState.form.error = error.message;
        } else if (error.message === 'ParseError') {
          watchedState.form.error = i18next.t('form.errors.invalidRss');
        } else if (error.name === 'AxiosError') {
          watchedState.form.error = 'form.errors.networkProblems';
        }
        watchedState.form.state = 'filling';
      });
  });
};

export default app;
