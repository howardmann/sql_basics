let knex = require('../../knex.js');

exports.seed = async function (knex, Promise) {
  // ======RACES
  // Clear out the DB
  await knex.raw('DELETE FROM Races')
  // Reset id number
  await knex.raw('ALTER SEQUENCE races_id_seq RESTART WITH 1')
  // Seed using RAW SQL
  await knex.raw(`
    INSERT INTO Races(id, name, description) VALUES
      (1, 'Zerg', 'Eats humans'),
      (2, 'Terran', 'Marine hoorah'),
      (3, 'Protoss', 'For Aiur'),
      (4, 'Xel Naga', '...');
  `)

  // ======PLANETS
  // Use knex and async await to create
  let Planets = knex('planets');
  await Planets.del()
  // TODO: reusable query
  await knex.raw('ALTER SEQUENCE planets_id_seq RESTART WITH 1')


  // Seed using JavaScript and Knex ORM
  let charBody = {
    name: "Char",
    moons: 0
  }

  let earthBody = {
    name: "Earth",
    moons: 1
  }

  let aiurBody = {
    name: "Aiur",
    moons: 6
  }

  let korhalBody = {
    name: 'Korhal',
    moons: 3
  }


  // TODO: make into a reusable create function
  let char = await Planets.insert(charBody).returning('*').then(result => result[0])
  let earth = await Planets.insert(earthBody).returning('*').then(result => result[0])
  let aiur = await Planets.insert(aiurBody).returning('*').then(result => result[0])
  let korhal = await Planets.insert(korhalBody).returning('*').then(result => result[0])

  // Clear out the DB
  await knex.raw('DELETE FROM Planets_Races')

  // find races
  let zerg = await knex('races').where('name', 'Zerg')
  let terran = await knex('races').where('name', 'Terran')
  let protoss = await knex('races').where('name', 'Protoss')
  let xelNaga = await knex('races').where('name', 'Xel Naga')

  await knex('planets_races').insert({
    planet_id: char.id,
    race_id: zerg[0].id
  })

  await knex('planets_races').insert({
    planet_id: earth.id,
    race_id: terran[0].id
  })

  await knex('planets_races').insert({
    planet_id: earth.id,
    race_id: zerg[0].id
  })

  

  // Clear out the DB
  await knex.raw('DELETE FROM Heroes')
  // Reset id number
  await knex.raw('ALTER SEQUENCE heroes_id_seq RESTART WITH 1')

  // ======HEROES
  let Heroes = knex('heroes');
  await Heroes.del()
  // TODO: reusable query
  await knex.raw('ALTER SEQUENCE heroes_id_seq RESTART WITH 1')

  let jim = {
    planet_id: earth.id,
    race_id: terran[0].id,
    alias: 'Jim Raynor',
    level: 5
  }
  let kerrigan = {
    planet_id: char.id,
    race_id: zerg[0].id,
    alias: 'Queen of Blades',
    level: 20
  }
  let zeratul = {
    planet_id: aiur.id,
    race_id: protoss[0].id,
    alias: 'Zeratul',
    level: 15
  }
  let mensk = {
    planet_id: korhal.id,
    race_id: terran[0].id,
    alias: 'Arcturus Mensk',
    level: 5
  }

  await Heroes.insert(jim)
  await Heroes.insert(kerrigan)
  await Heroes.insert(zeratul)
  await Heroes.insert(mensk)


};