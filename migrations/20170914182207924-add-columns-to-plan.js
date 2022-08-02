module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return queryInterface.addColumn(
        'Plans',
        'addressLineOne',
        {
          type: Sequelize.STRING,
        },
        {
          transaction,
        }
      )
        .then(() => {
          return queryInterface.addColumn(
            'Plans',
            'addressLineTwo',
            {
              type: Sequelize.STRING,
            },
            {
              transaction,
            }
          );
        })
        .then(() => {
          return queryInterface.addColumn(
            'Plans',
            'city',
            {
              type: Sequelize.STRING,
            },
            {
              transaction,
            }
          );
        })
        .then(() => {
          return queryInterface.addColumn(
            'Plans',
            'region',
            {
              type: Sequelize.STRING,
            },
            {
              transaction,
            }
          );
        })
        .then(() => {
          return queryInterface.addColumn(
            'Plans',
            'postalCode',
            {
              type: Sequelize.STRING,
            },
            {
              transaction,
            }
          );
        });
    });
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return queryInterface.removeColumn(
        'Plans',
        'postalCode',
        { transaction }
      )
        .then(() => {
          return queryInterface.removeColumn(
            'Plans',
            'region',
            { transaction }
          );
        })
        .then(() => {
          return queryInterface.removeColumn(
            'Plans',
            'city',
            { transaction }
          );
        })
        .then(() => {
          return queryInterface.removeColumn(
            'Plans',
            'addressLineTwo',
            { transaction }
          );
        })
        .then(() => {
          return queryInterface.removeColumn(
            'Plans',
            'addressLineOne',
            { transaction }
          );
        });
    });
  },
};
