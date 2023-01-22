/* eslint-disable no-param-reassign */
import _ from 'lodash';
import validate from './validate';
import getRSS from './getRSS';
import parser from './parser';
import render from './render';

const app = (initState, elements, i18next) => {
  const watchedState = render(initState, elements, i18next);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = elements.input;
    watchedState.form.valid = true;
    validate(value, initState.feeds, i18next)
      .then((url) => {
        watchedState.form.error = null;
        watchedState.form.state = 'processing';
        return getRSS(url);
      })
      .then((rss) => {
        const [feed, posts] = parser(rss.data.contents);
        const feedId = _.uniqueId();
        const feedWithId = { id: feedId, ...feed };
        const postsWithId = posts.map((post) => ({ id: _.uniqueId(), feedId, ...post }));
        console.log(feedWithId, postsWithId);
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
