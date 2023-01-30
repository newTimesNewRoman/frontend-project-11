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
  const view = render(initState, elements, i18n);
  update(view);

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const { value } = elements.input;
    view.form.valid = true;
    const urls = view.feeds.map((feed) => feed.url);
    validate(value, urls, i18n)
      .then((url) => {
        view.form.error = null;
        view.form.state = 'processing';
        return getRSS(url);
      })
      .then((rss) => {
        const [feed, posts] = parser(rss);
        const feedId = _.uniqueId();
        const feedWithIdandURL = { id: feedId, url: value, ...feed };
        const postsWithId = posts.map((post) => ({ id: _.uniqueId(), feedId, ...post }));
        view.form.state = 'success';
        view.feeds = [feedWithIdandURL, ...view.feeds];
        view.posts = [...postsWithId, ...view.posts];
      })
      .catch((error) => {
        view.form.valid = error.name !== 'ValidationError';
        if (error.name === 'ValidationError') {
          view.form.error = error.message;
        } else if (error.message === 'ParseError') {
          view.form.error = i18n.t('form.errors.invalidRss');
        } else if (error.name === 'AxiosError') {
          view.form.error = 'form.errors.networkProblems';
        } else {
          view.form.error = i18n.t('form.errors.unknownError');
        }
        view.form.state = 'filling';
      });
  });

  elements.modalWindow.addEventListener('show.bs.modal', (event) => {
    const postId = event.relatedTarget.dataset.id;
    view.ui.visitedPostsIds.add(postId);
    view.ui.modalWindowPostId = postId;
  });

  elements.postsConteiner.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      const postId = event.target.dataset.id;
      view.ui.visitedPostsIds.add(postId);
    }
  });
};

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

const initApp = () => {
  const i18nextInstance = i18next.createInstance();
  return i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  })
    .then(() => app(state, elements, i18nextInstance));
};

export default initApp;
