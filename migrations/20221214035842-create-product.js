'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ProductName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      ProductImage: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Price: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Discount: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      Material: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Origin: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Brand: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Category_ID: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories',
          key: 'id'
        }
      },
      IsActive: {
        defaultValue: true,
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};