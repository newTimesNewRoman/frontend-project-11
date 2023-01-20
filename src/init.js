import i18next from 'i18next';
import ru from './locales/ru.js';
import app from './app.js';

export default () => {
  const i18nextInstance = i18next.createInstance();
  return i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  })
    .then(() => {
      const state = {
        form: {
          state: 'filling',
          error: null,
          valid: true,
        },
        feeds: [],
        posts: [],
      };

      const elements = {
        form: document.querySelector('.rss-form'),
        input: document.querySelector('#url-input'),
        submit: document.querySelector('button[type="submit"]'),
        feedback: document.querySelector('.feedback'),
      };

      app(state, elements, i18nextInstance);
    });
};
