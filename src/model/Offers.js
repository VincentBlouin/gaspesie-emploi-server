module.exports = (sequelize, DataTypes) => {
  const Offers = sequelize.define('Offers', {
    title: DataTypes.STRING,
    dateOfHiring: DataTypes.DATE,
    salary: DataTypes.STRING,
    hoursType: DataTypes.STRING,
    nbHours: DataTypes.STRING,
    type: DataTypes.STRING,
    requirements: DataTypes.STRING,
    details: DataTypes.TEXT
  })
  Offers.defineAssociationsUsingModels = function (model, models) {
    model.hasMany(models.Appraisals, {as: 'appraisals'})
    model.belongsTo(models.Employers)
  }
  return Offers
}
