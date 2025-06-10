import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

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
    const alunos = await prisma.aluno.findMany();
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Erro ao buscar alunos' });
  }
});

// Get one aluno
router.get('/:id', async (req, res) => {
  try {
    const aluno = await prisma.aluno.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    res.json(aluno);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Erro ao buscar aluno' });
  }
});

// Create aluno
router.post('/', validateAluno, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const aluno = await prisma.aluno.create({
      data: req.body
    });
    res.status(201).json(aluno);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Erro ao criar aluno' });
  }
});

// Update aluno
router.put('/:id', validateAluno, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const aluno = await prisma.aluno.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(aluno);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update does not exist')) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    res.status(400).json({ message: error instanceof Error ? error.message : 'Erro ao atualizar aluno' });
  }
});

// Delete aluno
router.delete('/:id', async (req, res) => {
  try {
    await prisma.aluno.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Aluno removido com sucesso' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    res.status(500).json({ message: error instanceof Error ? error.message : 'Erro ao deletar aluno' });
  }
});

export default router; 