/* eslint-disable no-param-reassign */
import _ from 'lodash';
import getRSS from './getRSS';
import parser from './parser';

const update = (watchedState) => {
  const cb = () => {
    const savedUrls = watchedState.feeds.map((feed) => feed.url);
    const promises = savedUrls.map((url) => getRSS(url)
      .then((response) => {
        const [feed, posts] = parser(response);
        const feedWithURL = { url, ...feed };
        const feedId = _.find(watchedState.feeds, (item) => item.url === feedWithURL.url).id;
        const postsWithId = posts.map((post) => ({ id: _.uniqueId(), feedId, ...post }));
        const newPosts = _.differenceBy(postsWithId, Array.from(watchedState.posts), 'titlePost');
        if (newPosts.length !== 0) {
          watchedState.posts = [...newPosts, ...watchedState.posts];
        }
      })
      .catch((error) => console.log(error)));
    Promise.all(promises).finally(() => setTimeout(cb, 5000));
  };
  setTimeout(cb, 5000);
};

export default update;
