const yup = require('yup')
const InvalidParamError = require('../errors/invalid-param-error')

module.exports = class SignUpValidator {
  constructor () {
    this.schema = yup.object({
      firstName: yup
        .string()
        .min(3)
        .required(),
      lastName: yup
        .string()
        .min(3)
        .required(),
      phone: yup
        .string()
        .min(12)
        .test(
          'check-phone-format',
          'phone must be in the format [+55 xx xxxx-xxxx] or [+55 xx x xxxx-xxxx]',
          (value) => /^(\+\d{2} ?)?(\d{2,3} ?\d{4,5}-\d{4})$/.test(value)
        )
        .required(),
      email: yup
        .string()
        .email()
        .required(),
      password: yup
        .string()
        .min(8)
        .test(
          'check-uppercase',
          'password must be at least 1 lowercase character',
          (value) => /[a-z]/.test(value)
        )
        .test(
          'check-lowercase',
          'password must be at least 1 uppercase character',
          (value) => /[A-Z]/.test(value)
        )
        .test(
          'check-digit',
          'password must contain at least 1 number',
          (value) => /[0-9]/.test(value)
        )
        .required()
    })
  }

  async validate ({
    firstName,
    lastName,
    phone,
    email,
    password
  } = {}) {
    try {
      await this.schema.validate({
        firstName,
        lastName,
        phone,
        email,
        password
      }, {
        // abortEarly: false,
      })

      return true
    } catch (error) {
      throw new InvalidParamError(error.errors)
    }
  }
}
