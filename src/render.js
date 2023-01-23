/* eslint-disable no-param-reassign */
import onChange from 'on-change';

const renderError = (error, elements, i18next) => {
  elements.feedback.textContent = '';
  if (error) {
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
    elements.feedback.textContent = i18next.t(error);
  }
};

const showValid = (value, elements) => {
  if (!value) {
    elements.input.classList.add('is-invalid');
    return;
  }
  elements.input.classList.remove('is-invalid');
};

const handleProcessState = (processState, elements, i18next) => {
  switch (processState) {
    case 'filling':
      elements.input.readOnly = false;
      elements.submit.disabled = false;
      break;
    case 'processing':
      elements.input.readOnly = true;
      elements.submit.disabled = true;
      break;
    case 'success':
      elements.input.readOnly = false;
      elements.submit.disabled = false;
      elements.form.reset();
      elements.input.focus();
      elements.input.classList.remove('is-invalid');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = i18next.t('form.success');
      break;
    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

const renderFeeds = (value, elements, i18next) => {
  const headerFeeds = document.createElement('h2');
  headerFeeds.textContent = i18next.t('feeds');

  const feedsList = document.createElement('ul');
  feedsList.setAttribute('class', 'list-group mb-5');

  value.forEach((feed) => {
    const feedElement = document.createElement('li');
    feedElement.setAttribute('class', 'list-group-item');

    const feedTitle = document.createElement('h3');
    feedTitle.textContent = feed.title;
    const feedDescription = document.createElement('p');
    feedDescription.textContent = feed.description;

    feedElement.append(feedTitle, feedDescription);
    feedsList.append(feedElement);
  });
  elements.feedsConteiner.innerHTML = '';
  elements.feedsConteiner.prepend(feedsList);
  elements.feedsConteiner.prepend(headerFeeds);
};

const renderPosts = (state, elements, i18next) => {
  const headerPosts = document.createElement('h2');
  headerPosts.textContent = i18next.t('posts');

  const postsList = document.createElement('ul');
  postsList.setAttribute('class', 'list-group mb-5');

  state.posts.forEach((post) => {
    const postElement = document.createElement('li');
    postElement.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start');
    // const visitedLink = _.includes(state.uiState.visitedPosts, post.id);
    // eslint-disable-next-line max-len
    // const classLink = visitedLink ? 'font-weight-normal fw-normal text-decoration-none' : 'font-weight-bold fw-bold text-decoration-none';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', post.link);
    linkElement.setAttribute('class', 'font-weight-bold fw-bold text-decoration-none');
    linkElement.setAttribute('data-id', post.id);
    linkElement.setAttribute('target', '_blank');
    linkElement.setAttribute('rel', 'noopener noreferrer');
    linkElement.textContent = post.title;

    const buttonElement = document.createElement('button');
    buttonElement.setAttribute('type', 'button');
    buttonElement.setAttribute('class', 'btn btn-primary btn-sm');
    buttonElement.setAttribute('data-id', post.id);
    buttonElement.setAttribute('data-bs-toggle', 'modal');
    buttonElement.setAttribute('data-bs-target', '#modal');
    buttonElement.textContent = i18next.t('viewButton');

    postElement.append(linkElement, buttonElement);
    postsList.prepend(postElement);
  });
  elements.postsConteiner.innerHTML = '';
  elements.postsConteiner.prepend(postsList);
  elements.postsConteiner.prepend(headerPosts);
};

export default (state, elements, i18next) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.error':
      renderError(value, elements, i18next);
      break;
    case 'form.valid':
      showValid(value, elements);
      break;
    case 'form.state':
      handleProcessState(value, elements, i18next);
      break;
    case 'feeds':
      renderFeeds(value, elements, i18next);
      break;
    case 'posts':
      renderPosts(state, elements, i18next);
      break;
    default:
      throw new Error(`Unknown path: ${path}`);
  }
});
