/* eslint-disable no-param-reassign */
import _ from 'lodash';
import validate from './validate';
import getRSS from './getRSS';
import parser from './parser';
import render from './render';
import update from './update';

const app = (initState, elements, i18next) => {
  const watchedState = render(initState, elements, i18next);
  update(watchedState);

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const { value } = elements.input;
    watchedState.form.valid = true;
    const urls = watchedState.feeds.map((feed) => feed.url);
    validate(value, urls, i18next)
      .then((url) => {
        watchedState.form.error = null;
        watchedState.form.state = 'processing';
        return getRSS(url);
      })
      .then((rss) => {
        const [feed, posts] = parser(rss);
        const feedId = _.uniqueId();
        const feedWithId = { id: feedId, ...feed };
        const postsWithId = posts.map((post) => ({ id: _.uniqueId(), feedId, ...post }));
        watchedState.form.state = 'success';
        watchedState.feeds = [feedWithId, ...watchedState.feeds];
        watchedState.posts = [...postsWithId, ...watchedState.posts];
      })
      .catch((error) => {
        watchedState.form.valid = error.name !== 'ValidationError';
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

  elements.modalWindow.addEventListener('show.bs.modal', (event) => {
    const postId = event.relatedTarget.dataset.id;
    watchedState.visitedPosts.push(postId);
    watchedState.modalWindowPostId = postId;
  });
};

export default app;
