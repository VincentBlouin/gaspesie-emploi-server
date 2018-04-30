const Joi = require('joi')
module.exports = {
  register (req, res, next) {
    const schema = {
      firstName: Joi.string(),
      lastName: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string(),
      locale: Joi.string()
    }
    const {error} = Joi.validate(req.body, schema)
    if (error) {
      switch (error.details[0].context.key) {
        case 'email':
          return res.status(400).send({
            error: 'You must provide a valid email address'
          })
        case 'password':
          return res.status(400).send({
            error: `The password provided failed to match the following rules :
                            <br>                            
                           1: It must contain ONLY the following characters :lower. .
                           2. 
                        `
          })
        default:
          return res.status(400).send({
            error: 'Invalid registration information'
          })
      }
    } else {
      next()
    }
  }
}
