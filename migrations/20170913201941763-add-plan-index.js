module.exports = {
  up: (queryInterface) => {
    return queryInterface.addIndex(
      'Plans',
      ['accountId'],
      {
        indexName: 'PlanAccountIdIndex',
        indicesType: 'UNIQUE',
      }
    );
  },
  down: (queryInterface) => {
    return queryInterface.removeIndex('Plans', 'PlanAccountIdIndex');
  },
};
