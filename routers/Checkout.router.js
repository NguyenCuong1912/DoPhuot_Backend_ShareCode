const express = require('express');
const { Func_Checkout, AllBill, GetBillByID_User, FindDetailBill } = require('../controllers/Checkout.controller');

const checkoutRouter = express.Router();

checkoutRouter.post('/', Func_Checkout)
checkoutRouter.get('/ByAccount/:id', GetBillByID_User)
checkoutRouter.get('/', AllBill)

checkoutRouter.get('/Detail/:id', FindDetailBill)
module.exports = {
    checkoutRouter
}