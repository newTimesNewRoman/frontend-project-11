import * as yup from 'yup';

export default (url, feeds, i18next) => {
  yup.setLocale({
    string: {
      url: i18next.t('form.errors.invalidUrl'),
    },
    mixed: {
      required: i18next.t('form.errors.required'),
      notOneOf: i18next.t('form.errors.notUniqueUrl'),
    },
  });

  const schema = yup
    .string()
    .url()
    .notOneOf(feeds);

  return schema
    .validate(url)
    .catch((error) => {
      throw error;
    });
};
