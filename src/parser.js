export default (rss) => {
  const parser = new DOMParser();
  const parsedRss = parser.parseFromString(rss, 'application/xml');
  const parseError = parsedRss.querySelector('parsererror');
  if (parseError) {
    throw new Error('ParseError');
  } else {
    const feed = {
      title: parsedRss.querySelector('title').textContent,
      description: parsedRss.querySelector('description').textContent,
    };

    const posts = Array.from(parsedRss.querySelectorAll('item'))
      .map((item) => (
        {
          title: item.querySelector('title').textContent,
          description: item.querySelector('description').textContent,
          link: item.querySelector('link').textContent,
        }
      ));
    return [feed, posts];
  }
};
