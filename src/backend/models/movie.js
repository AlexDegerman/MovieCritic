const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('movie', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    genres: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    release_date: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    runtime: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    director: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    writers: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    main_actors: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    original_language: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    overview: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    poster_path: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tagline: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tmdb_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: "tmdb_id"
    }
  }, {
    sequelize,
    tableName: 'movie',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "tmdb_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "tmdb_id" },
        ]
      },
      {
        name: "idx_movie_search",
        using: "BTREE",
        fields: [
          { name: "title" },
          { name: "genres" },
        ]
      },
      {
        name: "idx_tmdb_id",
        using: "BTREE",
        fields: [
          { name: "tmdb_id" },
        ]
      },
    ]
  })
}
