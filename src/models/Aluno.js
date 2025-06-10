const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database').development;

class Aluno extends Model {}

Aluno.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nome é obrigatório'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Email inválido'
      },
      notEmpty: {
        msg: 'Email é obrigatório'
      }
    }
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Telefone é obrigatório'
      }
    }
  },
  curso: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Curso é obrigatório'
      }
    }
  }
}, {
  sequelize,
  modelName: 'Aluno',
  timestamps: true,
  underscored: true
});

module.exports = Aluno; 