module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Roles',
      ['USER', 'ADMIN'].map((name, index) => ({
        id: index + 1,
        name,
        updatedAt: '2019-09-05 16:35:28.029+00',
        createdAt: '2019-09-05 16:35:28.029+00'
      })),
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', null, {})
  }
}
