module.exports = (sequelize, DataTypes) => {
  const Employers = sequelize.define('Employers', {
    name: DataTypes.STRING,
    telephone: DataTypes.STRING,
    email: DataTypes.STRING,
    city: DataTypes.STRING,
    address: DataTypes.STRING
  })
  Employers.defineAssociationsUsingModels = function (model, models) {
    model.belongsTo(models.Users)
  }
  return Employers
}
