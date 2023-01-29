import * as yup from 'yup';

const validate = (urlValidate, urls, i18next) => {
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
    .notOneOf(urls);

  return schema
    .validate(urlValidate)
    .catch((error) => {
      console.log('ERROR validate', error);
      throw error;
    });
};

export default validate;
