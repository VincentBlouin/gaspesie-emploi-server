module.exports = (sequelize, DataTypes) => {
  const Appraisals = sequelize.define('Appraisals', {
    value: DataTypes.STRING
  })
  Appraisals.defineAssociationsUsingModels = function (model, models) {
    model.belongsTo(models.Users, {as: 'judge'})
    model.belongsTo(models.Users, {as: 'subject'})
    model.belongsTo(models.Offers)
  }
  return Appraisals
}
