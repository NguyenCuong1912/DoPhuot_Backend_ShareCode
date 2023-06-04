"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Checkouts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      Account_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Accounts",
          key: "id",
        },
      },
      TotalMoney: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      MethodCheckout: {
        //! online or payment-before
        type: Sequelize.STRING,
      },
      ConfirmCheckout: {
        //! true - confirm  false - no confirm
        type: Sequelize.BOOLEAN,
      },
      StatusAwait: {
        //!  true done pendding package  - false pendding package
        type: Sequelize.BOOLEAN,
      },
      StatusDelivery: {
        //!  true padding deli
        type: Sequelize.BOOLEAN,
      },
      StatusDone: {
        //!  true done package
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Checkouts");
  },
};
