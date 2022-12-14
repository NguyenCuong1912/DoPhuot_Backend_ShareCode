const { Checkout, DetailCheckout, Account, Product } = require('../models')

const Func_Checkout = async (req, res) => {
    const { Account_ID, ListProduct } = req.body;
    try {
        if (Account_ID && ListProduct.length != 0) {
            let total = 0;
            let checkoutResult = {}
            ListProduct.forEach(product => {
                total += (product.Price * product.Quantity) - (product.Price * product.Quantity * product.Discount / 100);
            });
            const result = await Checkout.create({
                Account_ID, TotalMoney: total.toString()
            }).then(async (data) => {
                checkoutResult.Checkout = data;
                checkoutResult.OrderProduct = [];
                for (const product of ListProduct) {
                    const detailCheckout = await DetailCheckout.create({
                        Product_ID: product.Product_ID,
                        Price: product.Price,
                        Quantity: product.Quantity,
                        Discount: product.Discount,
                        Checkout_ID: data.id
                    })
                    await checkoutResult.OrderProduct.push(detailCheckout)
                }
                res.status(200).send(checkoutResult)
            })
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
        res.status(500).send(error)
    }
}

const AllBill = async (req, res) => {
    try {
        const lstBill = await Checkout.findAll({
            include: [
                {
                    model: Account,
                    as: 'Account'
                }
            ]
        });
        res.status(200).send(lstBill)
    } catch (error) {
        res.status(500).send(error)
    }
}
const GetBillByID_User = async (req, res) => {
    const { id } = req.params;
    try {

        const check = await Checkout.findAll({
            where: { Account_ID: id },
            attributes: {
                exclude: ["Account_ID"]
            }
        }).then(async (lstBill) => {
            let arrBill = []
            for (const bill of lstBill) {
                const detailBill = await DetailCheckout.findAll({
                    where: {
                        Checkout_ID: bill.id
                    },
                    include: [
                        {
                            model: Product,
                            as: 'Product',
                            attributes: ['ProductName', 'Price', "ProductImage"],
                        }
                    ],
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'Product_ID', "Checkout_ID"]
                    },
                })
                if (detailBill) {
                    const _bill = {
                        Bill: bill,
                        Detail: detailBill
                    }
                    arrBill = [...arrBill, _bill]
                }
            }
            res.status(200).send(arrBill)
        })

    } catch (error) {
        res.status(500).send(error)
    }
}

const FindDetailBill = async (req, res) => {
    const { id } = req.params;
    try {
        const billDetail = await DetailCheckout.findAll({
            where: {
                Checkout_ID: id
            },
            include: [
                {
                    model: Product,
                    as: 'Product',
                    attributes: ['ProductName', 'Discount', "ProductImage"],
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'Product_ID']
            },
        })
        res.status(200).send(billDetail)
    } catch (error) {
        res.status(500).send(error)
    }
}
module.exports = {
    Func_Checkout,
    AllBill,
    GetBillByID_User,
    FindDetailBill
}