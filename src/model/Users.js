const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

function hashPassword (user, options) {
  const SALT_FACTOR = 8
  if (!user.changed('password')) {
    return
  }
  return bcrypt
    .genSaltAsync(SALT_FACTOR)
    .then(salt => bcrypt.hashAsync(user.password, salt, null))
    .then(hash => {
      user.setDataValue('password', hash)
    })
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.DATE,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    status: DataTypes.STRING,
    locale: DataTypes.STRING,
    telephone: DataTypes.STRING,
    candidateProfile: DataTypes.TEXT
  }, {
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword
    }
  })
  User.prototype.comparePassword = function (password) {
    return bcrypt.compareAsync(password, this.password)
  }
  User.defineAssociationsUsingModels = function (model, models) {
    model.hasMany(models.Offers)
  }
  return User
}
