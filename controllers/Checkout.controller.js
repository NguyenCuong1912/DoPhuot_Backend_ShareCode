const {
  Checkout,
  DetailCheckout,
  Account,
  Product,
  sequelize,
} = require("../models");
const { QueryTypes } = require("sequelize");
var paypal = require("paypal-rest-sdk");
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AVz4c0swAR4iw7z3EyedzzfoaLtOJB49piDMCYKbl7dH5GAfrnCHWNDIOpua8ZdYTCyC0ToBAMs28w21",
  client_secret:
    "EGAGDrgVP7o4jPkLE0GTDKaWRgTyNXQeyplMerpqxZxZ1tgp5mDXGJZw4Pab3NQA6RJdD4gy6RJI6uen",
});
const Require_Checkout = async (req, res) => {
  const { data, sum } = req.body;
  console.log(req.body);
  let total = 0;
  for (let index = 0; index < req.body.data.length; index++) {
    req.body.data[index].price *= 1;
    total += req.body.data[index].price;
  }
  var create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/error",
    },
    transactions: [
      {
        item_list: {
          items: data,
        },
        amount: {
          currency: "USD",
          total: total,
        },
        description: "This is the payment description.",
      },
    ],
  };
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      for (let index = 0; index < payment.links.length; index++) {
        if (payment.links[index].rel === "approval_url")
          res.status(200).send(payment.links[index].href);
      }
    }
  });
};
const Func_Checkout = async (req, res) => {
  const { Account_ID, ListProduct, Method } = req.body;
  console.log(req.body);

  try {
    if (Account_ID && ListProduct.length != 0) {
      let total = 0;
      let checkoutResult = {};
      ListProduct.forEach((product) => {
        total +=
          product.Price * product.Quantity -
          (product.Price * product.Quantity * product.Discount) / 100;
      });
      const result = await Checkout.create({
        Account_ID,
        TotalMoney: total.toString(),
        MethodCheckout: Method,
        ConfirmCheckout: true,
        StatusAwait: true,
      }).then(async (data) => {
        checkoutResult.Checkout = data;
        checkoutResult.OrderProduct = [];
        for (const product of ListProduct) {
          const detailCheckout = await DetailCheckout.create({
            Product_ID: product.Product_ID,
            Price: product.Price,
            Quantity: product.Quantity,
            Discount: product.Discount,
            Checkout_ID: data.id,
          });
          await checkoutResult.OrderProduct.push(detailCheckout);
        }
        res.status(200).send(checkoutResult);
      });
    } else {
      if (!Account_ID) {
        res.status(400).send("You can login");
      } else if (!ListProduct) {
        res.status(400).send("You can choose Product");
      } else {
        res.status(403).send("Checkout fail");
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
const changeStatusAwait = async (req, res) => {
  const { idBill } = req.body;
  try {
    const detailBill = await Checkout.findOne({ id: idBill });
    console.log(detailBill);
  } catch (error) {
    res.status(500).send(error);
  }
};
const AllBill = async (req, res) => {
  try {
    const lstBill = await Checkout.findAll({
      include: [
        {
          model: Account,
          as: "Account",
        },
      ],
    });
    res.status(200).send(lstBill);
  } catch (error) {
    res.status(500).send(error);
  }
};
const GetBillByID_User = async (req, res) => {
  const { id } = req.params;
  try {
    const check = await Checkout.findAll({
      where: { Account_ID: id },
      attributes: {
        exclude: ["Account_ID"],
      },
    }).then(async (lstBill) => {
      let arrBill = [];
      for (const bill of lstBill) {
        const detailBill = await DetailCheckout.findAll({
          where: {
            Checkout_ID: bill.id,
          },
          include: [
            {
              model: Product,
              as: "Product",
              attributes: ["ProductName", "Price", "ProductImage"],
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "Product_ID", "Checkout_ID"],
          },
        });
        if (detailBill) {
          const _bill = {
            Bill: bill,
            Detail: detailBill,
          };
          arrBill = [...arrBill, _bill];
        }
      }
      res.status(200).send(arrBill);
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const FindDetailBill = async (req, res) => {
  const { id } = req.params;
  try {
    const billDetail = await DetailCheckout.findAll({
      where: {
        Checkout_ID: id,
      },
      include: [
        {
          model: Product,
          as: "Product",
          attributes: ["ProductName", "Discount", "ProductImage"],
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "Product_ID"],
      },
    });
    res.status(200).send(billDetail);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getToTalWithMonth = async (req, res) => {
  try {
    let arr = [];
    for (let index = 1; index <= 12; index++) {
      const result = await sequelize.query(
        `
          select sum(ToTalMoney) as total from Checkouts where month(createdAt) = ${index}
            `,
        { type: QueryTypes.SELECT }
      );
      let totalWithMonth = result[0];
      if (totalWithMonth.total === null) {
        totalWithMonth.total = 0;
      }
      arr = [...arr, totalWithMonth];
    }
    res.status(200).send(arr);
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports = {
  changeStatusAwait,
  Func_Checkout,
  Require_Checkout,
  AllBill,
  GetBillByID_User,
  FindDetailBill,
  getToTalWithMonth,
};
