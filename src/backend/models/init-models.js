var DataTypes = require("sequelize").DataTypes
var _arvostelut = require("./arvostelut")
var _elokuva = require("./elokuva")
var _jasen = require("./jasen")
var _movie = require("./movie")

function initModels(sequelize) {
  var arvostelut = _arvostelut(sequelize, DataTypes)
  var elokuva = _elokuva(sequelize, DataTypes)
  var jasen = _jasen(sequelize, DataTypes)
  var movie = _movie(sequelize, DataTypes)

  arvostelut.belongsTo(elokuva, { as: "elokuva", foreignKey: "elokuvaid"})
  elokuva.hasMany(arvostelut, { as: "arvosteluts", foreignKey: "elokuvaid"})
  arvostelut.belongsTo(jasen, { as: "jasen", foreignKey: "jasenid"})
  jasen.hasMany(arvostelut, { as: "arvosteluts", foreignKey: "jasenid"})
  arvostelut.belongsTo(movie, { as: "tmdb", foreignKey: "tmdb_id"})
  movie.hasMany(arvostelut, { as: "arvosteluts", foreignKey: "tmdb_id"})
  elokuva.belongsTo(movie, { as: "movie", foreignKey: "tmdb_id", targetKey: "tmdb_id"})
  movie.hasMany(elokuva, { as: "elokuvas", foreignKey: "tmdb_id", sourceKey: "tmdb_id"})

  return {
    arvostelut,
    elokuva,
    jasen,
    movie,
  }
}
module.exports = initModels
module.exports.initModels = initModels
module.exports.default = initModels