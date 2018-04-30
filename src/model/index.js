const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config')
const db = {}
const dbConfig = config.getConfig().db

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  dbConfig.options
)

fs
  .readdirSync(__dirname)
  .filter((file) =>
    file !== 'index.js'
  )
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

for (const key in db) {
  const model = db[key]
  if (model.defineAssociationsUsingModels) {
    model.defineAssociationsUsingModels(
      model,
      db
    )
  }
}

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
