const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('arvostelut', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    elokuvaid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'elokuva',
        key: 'id'
      }
    },
    jasenid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'jasen',
        key: 'id'
      }
    },
    otsikko: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    sisalto: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tahdet: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nimimerkki: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    luotuaika: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    elokuvanOtsikko: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    elokuvanTitle: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tmdb_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'movie',
        key: 'tmdb_id'
      }
    },
    tykkaykset: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'arvostelut',
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
        name: "arvostelut_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "jasenid" },
        ]
      },
      {
        name: "arvostelut_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "elokuvaid" },
        ]
      },
      {
        name: "tmdb_id",
        using: "BTREE",
        fields: [
          { name: "tmdb_id" },
        ]
      },
    ]
  });
};
