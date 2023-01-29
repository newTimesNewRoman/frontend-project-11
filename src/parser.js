const parserRSS = (rss) => {
  console.log('parser.data', rss.data);
  console.log('parser.data.contents', rss.data.contents);
  const parser = new DOMParser();
  const parsedRss = parser.parseFromString(rss.data.contents, 'text/xml');
  const parseError = parsedRss.querySelector('parsererror');
  console.log(parsedRss, parseError);
  if (parseError) {
    console.log('PARSE ERROR', parseError);
    throw new Error('ParseError');
  } else {
    const feed = {
      title: parsedRss.querySelector('title').textContent,
      description: parsedRss.querySelector('description').textContent,
      url: rss.data.status.url,
    };
    console.log(feed);
    const posts = Array.from(parsedRss.querySelectorAll('item'))
      .map((item) => {
        console.log(item);
        return {
          title: item.querySelector('title').textContent,
          description: item.querySelector('description').textContent,
          link: item.querySelector('link').textContent,
        };
      });
    console.log(posts);
    return [feed, posts];
  }
};

export default parserRSS;
