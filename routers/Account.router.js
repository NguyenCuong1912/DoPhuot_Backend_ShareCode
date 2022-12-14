const express = require('express');
const { SignUp, SignIn, UpdateAccount, DeleteAccount, AllAccount, DetailAccount } = require('../controllers/Account.controller');

const accountRouter = express.Router();

accountRouter.post('/SignUp', SignUp)
accountRouter.post('/SignIn', SignIn)
accountRouter.put('/:id', UpdateAccount)
accountRouter.put('/Delete/:id', DeleteAccount)
accountRouter.get('/', AllAccount)
accountRouter.get('/:id', DetailAccount)
module.exports = {
    accountRouter
}