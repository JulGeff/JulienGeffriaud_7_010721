

const mysqlTable = process.env.DB_TABLE;
const mysqlUsername = process.env.DB_USERNAME;     
const mysqlPassword = process.env.DB_PASSWORD;          
const { Sequelize } = require('sequelize');

const fs = require("fs")
const path = require("path")
const Sequelize = require("sequelize")
const basename = path.basename(__filename)
require('dotenv').config()            // importation dotenv pour sécuriser passwords
const db = {}

const sequelize = new Sequelize(mysqlTable, mysqlUsername, mysqlPassword, {
    host : 'localhost',
    dialect: 'mysql'
  
  })

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === ".js")
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
        db[model.name] = model
    })

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

db.users = require("./user.js")(sequelize, Sequelize)

module.exports = db