module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Plans',
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },

        uuid: {
          type: Sequelize.UUID,
          notEmpty: true,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
        },

        accountId: {
          type: Sequelize.BIGINT,
          notEmpty: true,
          allowNull: false,
          unique: true,
        },

        allowedSeats: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },

        seats: {
          type: Sequelize.INTEGER,
        },

        plan: {
          type: Sequelize.STRING,
        },

        customer: {
          type: Sequelize.STRING,
        },

        subscription: {
          type: Sequelize.STRING,
        },

        billingEmail: {
          type: Sequelize.STRING,
        },

        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE,
      }
    );
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('Plans');
  },
};
