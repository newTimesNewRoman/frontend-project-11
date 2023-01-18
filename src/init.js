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
        streamLoadingStatus: 'init',
        validStatus: null,
        errorMsgFeedback: null,
        feeds: [],
        posts: [],
        uiState: {
          modalPostId: null,
          visitedPosts: [],
        },
      };
      app(state, i18nextInstance);
    });
};
