/* eslint-disable no-param-reassign */
import i18next from 'i18next';
import _ from 'lodash';
import ru from './locales/ru.js';
import validate from './validate';
import getRSS from './getRSS';
import parser from './parser';
import render from './render';
import update from './update';

const app = (initState, elements, i18n) => {
  const watchedState = render(initState, elements, i18n);
  update(watchedState);

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const { value } = elements.input;
    watchedState.form.valid = true;
    const urls = watchedState.feeds.map((feed) => feed.url);
    validate(value, urls, i18n)
      .then((url) => {
        watchedState.form.error = null;
        watchedState.form.state = 'processing';
        return getRSS(url);
      })
      .then((rss) => {
        const [feed, posts] = parser(rss);
        const feedId = _.uniqueId();
        const feedWithIdandURL = { id: feedId, url: value, ...feed };
        const postsWithId = posts.map((post) => ({ id: _.uniqueId(), feedId, ...post }));
        watchedState.form.state = 'success';
        watchedState.feeds = [feedWithIdandURL, ...watchedState.feeds];
        watchedState.posts = [...postsWithId, ...watchedState.posts];
      })
      .catch((error) => {
        watchedState.form.valid = error.name !== 'ValidationError';
        if (error.name === 'ValidationError') {
          watchedState.form.error = error.message;
        } else if (error.message === 'ParseError') {
          watchedState.form.error = i18n.t('form.errors.invalidRss');
        } else if (error.name === 'AxiosError') {
          watchedState.form.error = 'form.errors.networkProblems';
        } else {
          watchedState.form.error = i18n.t('form.errors.unknownError');
        }
        watchedState.form.state = 'filling';
      });
  });

  elements.modalWindow.addEventListener('show.bs.modal', (event) => {
    const postId = event.relatedTarget.dataset.id;
    watchedState.ui.visitedPostsIds.add(postId);
    watchedState.ui.modalWindowPostId = postId;
  });

  elements.postsConteiner.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      const postId = event.target.dataset.id;
      watchedState.ui.visitedPostsIds.add(postId);
    }
  });
};

const initApp = () => {
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
        ui: {
          modalWindowPostId: null,
          visitedPostsIds: new Set(),
        },
      };

      const elements = {
        form: document.querySelector('.rss-form'),
        input: document.querySelector('#url-input'),
        submit: document.querySelector('button[type="submit"]'),
        feedback: document.querySelector('.feedback'),
        feedsConteiner: document.querySelector('.feeds'),
        postsConteiner: document.querySelector('.posts'),
        modalWindow: document.querySelector('#modal'),
        modalTitle: document.querySelector('.modal-title'),
        modalBody: document.querySelector('.modal-body'),
        modalBtnLink: document.querySelector('.full-article'),
      };

      app(state, elements, i18nextInstance);
    });
};

export default initApp;
