const express = require('express');
const { Product } = require('../models')

const { CheckExists } = require('../middleware/validations/CheckExists');

const { uploadImage } = require('../middleware/uploads/upload_Image');
const { AddProduct, AllProduct, DetailProduct, DeleteProduct, UpdateProduct } = require('../controllers/Product.controller');


const productRouter = express.Router();

productRouter.post('/', uploadImage('products'), AddProduct)
productRouter.put('/:id', CheckExists(Product), uploadImage('products'), UpdateProduct)
productRouter.put('/Delete/:id', CheckExists(Product), DeleteProduct)
productRouter.get('/', AllProduct)
productRouter.get('/:id', CheckExists(Product), DetailProduct)
module.exports = {
    productRouter
}