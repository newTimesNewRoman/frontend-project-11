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
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = i18next.t('form.success');
      break;
    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

export default (state, elements, i18next) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.error':
      renderError(value, elements, i18next);
      break;
    case 'form.valid':
      if (!value) {
        elements.input.classList.add('is-invalid');
        return;
      }
      elements.input.classList.remove('is-invalid');
      break;
    case 'form.state':
      handleProcessState(value, elements, i18next);
      break;
    default:
      throw new Error(`Unknown path: ${path}`);
  }
});
