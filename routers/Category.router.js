const express = require('express');
const { Category } = require('../models')
const { AddCategory, AllCategory, DetailCategory, UpdateCategory, DeleteCategory } = require('../controllers/Category.controller');
const { CheckExists } = require('../middleware/validations/CheckExists')

const categoryRouter = express.Router();

categoryRouter.post('/', AddCategory)
categoryRouter.get('/', AllCategory)
categoryRouter.get('/:id', CheckExists(Category), DetailCategory)

categoryRouter.put('/:id', CheckExists(Category), UpdateCategory)
categoryRouter.put('/Delete/:id', CheckExists(Category), DeleteCategory)
module.exports = {
    categoryRouter
}