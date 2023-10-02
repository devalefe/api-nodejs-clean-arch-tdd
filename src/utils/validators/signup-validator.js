const yup = require('yup')
const { InvalidParamError } = require('../errors')

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required('O nome é obrigatório'),
  lastName: yup
    .string()
    .required('O sobrenome é obrigatório'),
  phone: yup
    .string()
    .matches(
      /^55\d{2}\d{4,5}\d{4}$/,
      'Número de telefone no formato inválido'
    )
    .required('O número de telefone é obrigatório'),
  email: yup
    .string()
    .email('Email informado é inválido')
    .required('O email é obrigatório'),
  password: yup
    .string()
    .required('A senha é obrigatória')
    .min(8, 'Precisa conter 8 ou mais caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z]).*$/,
      'Pelo menos 1 letra minúscula é necessário'
    )
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z]).*$/,
      'Pelo menos 1 letra maiúscula é necessário'
    )
    .matches(
      /^(?=.*\d).*$/,
      'Pelo menos 1 número é necessário'
    )
    .matches(
      /^(?=.*[\W_]).*$/,
      'Pelo menos 1 símbolo é necessário'
    )
})

module.exports = class SignUpValidator {
  async validate (data = {}) {
    try {
      const result = await schema
        .validate(data, { abortEarly: false })
      return result
    } catch (error) {
      const serializedErrors = {}
      error.inner.map(({ path, errors }) =>
        Object.assign(serializedErrors, { [path]: errors })
      )
      throw new InvalidParamError(
        'Erro ao validar os campos',
        serializedErrors
      )
    }
  }
}
