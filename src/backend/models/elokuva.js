const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('elokuva', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    otsikko: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    lajityypit: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    valmistumisvuosi: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    pituus: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ohjaaja: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    kasikirjoittajat: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    paanayttelijat: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    alkuperainen_kieli: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    kuvaus: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    kuvan_polku: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    iskulause: {
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
    tableName: 'elokuva',
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
        name: "idx_elokuva_search",
        using: "BTREE",
        fields: [
          { name: "otsikko" },
          { name: "lajityypit" },
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
