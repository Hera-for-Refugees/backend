'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Roles',
      ['Vaccine', 'Pregnancy', 'General'].map((name, index) => ({
        id: index + 1,
        name,
        updatedAt: '2019-09-05 16:35:28.029+00',
        createdAt: '2019-09-05 16:35:28.029+00'
      })),
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
}
