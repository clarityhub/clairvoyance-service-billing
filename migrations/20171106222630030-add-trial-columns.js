module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      const now = (new Date()).toISOString();
      return queryInterface.addColumn(
        'Plans',
        'trialStart',
        {
          type: Sequelize.DATE,
          defaultValue: now,
        },
        { transaction }
      )
        .then(() => {
          return queryInterface.addColumn(
            'Plans',
            'trialLength',
            {
              type: Sequelize.INTEGER,
              defaultValue: 30,
            },
            { transaction }
          );
        });
    });
  },
  down: (queryInterface) => {
    return queryInterface.sequalize.transaction((transaction) => {
      return queryInterface.removeColumn(
        'Plans',
        'trialStart',
        { transaction }
      )
        .then(() => {
          return queryInterface.removeColumn(
            'Plans',
            'trialLength',
            { transaction }
          );
        });
    });
  },
};
