const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Aluno = require('../models/Aluno');

// Validation middleware
const validateAluno = [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('telefone').notEmpty().withMessage('Telefone é obrigatório'),
  body('curso').notEmpty().withMessage('Curso é obrigatório')
];

// Get all alunos
router.get('/', async (req, res) => {
  try {
    const alunos = await Aluno.findAll();
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get one aluno
router.get('/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id);
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    res.json(aluno);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create aluno
router.post('/', validateAluno, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const aluno = await Aluno.create(req.body);
    res.status(201).json(aluno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update aluno
router.put('/:id', validateAluno, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const aluno = await Aluno.findByPk(req.params.id);
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    await aluno.update(req.body);
    res.json(aluno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete aluno
router.delete('/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id);
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    await aluno.destroy();
    res.json({ message: 'Aluno removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 