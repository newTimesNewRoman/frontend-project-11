/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import watch from './render';

const validateUrl = (url, feeds, i18next) => {
  yup.setLocale({
    string: {
      url: i18next.t('form.errors.notValidUrl'),
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

const app = (initState, i18next) => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    submit: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
  };

  const watchedState = watch(initState, elements, i18next);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = elements.input;
    validateUrl(value, initState.feeds, i18next)
      .then((url) => {
        watchedState.form.error = null;
        watchedState.form.state = 'processing';
        console.log(url);
        // return fetchData(url);
      })
      .catch((error) => {
        watchedState.form.valid = error.name !== 'ValidationError';
        if (error.name === 'ValidationError') {
          watchedState.form.error = error.message;
        } /* else if (error.NotValidRss) {
          watchedState.form.error = 'form.errors.notValidRss';
        }  else if (axios.isAxiosError(err)) {
          watchedState.form.error = 'form.errors.networkProblems';
        } */
        watchedState.form.state = 'filling';
      });
  });
};

export default app;
