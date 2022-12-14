const express = require('express');
const { accountRouter } = require('./Account.router');
const { categoryRouter } = require('./Category.router');
const { productRouter } = require('./Product.router');
const { checkoutRouter } = require('./Checkout.router');



const rootRouter = express.Router();
rootRouter.use('/Account', accountRouter)
rootRouter.use('/Category', categoryRouter)
rootRouter.use('/Product', productRouter)
rootRouter.use('/Checkout', checkoutRouter)
module.exports = {
    rootRouter
}