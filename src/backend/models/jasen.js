const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('jasen', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sahkopostiosoite: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: "sahkopostiosoite"
    },
    salasana: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "salasana"
    },
    nimimerkki: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "nimimerkki"
    },
    liittymispaiva: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    sukupuoli: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    paikkakunta: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    harrastukset: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    suosikkilajityypit: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    suosikkifilmit: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    omakuvaus: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    omatarvostelut: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'jasen',
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
        name: "sahkopostiosoite",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "sahkopostiosoite" },
        ]
      },
      {
        name: "nimimerkki",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "nimimerkki" },
        ]
      },
      {
        name: "salasana",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "salasana" },
        ]
      },
    ]
  });
};
