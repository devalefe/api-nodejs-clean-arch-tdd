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
    .required('O email é obrigatório')
})

module.exports = class UpdateAccountValidator {
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
