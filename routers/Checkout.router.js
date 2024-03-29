const express = require("express");
const {
  Func_Checkout,
  AllBill,
  GetBillByID_User,
  FindDetailBill,
  Require_Checkout,
  getToTalWithMonth,
  changeStatusAwait,
  changeStatusDelivery,
  changeStatusDone,
} = require("../controllers/Checkout.controller");

const checkoutRouter = express.Router();
checkoutRouter.get("/Total/Month/Chart", getToTalWithMonth);

checkoutRouter.post("/", Func_Checkout);
checkoutRouter.post("/RequireCheckout/paypal", Require_Checkout);
checkoutRouter.put("/ChangeStatusAwait", changeStatusAwait);
checkoutRouter.put("/ChangeStatusDelivery", changeStatusDelivery);
checkoutRouter.put("/ChangeStatusDone", changeStatusDone);

checkoutRouter.get("/ByAccount/:id", GetBillByID_User);
checkoutRouter.get("/", AllBill);

checkoutRouter.get("/Detail/:id", FindDetailBill);
module.exports = {
  checkoutRouter,
};
