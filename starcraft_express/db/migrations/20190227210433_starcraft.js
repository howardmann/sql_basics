
exports.up = function(knex, Promise) {
  return knex.raw(`
    CREATE TABLE Races(
      id serial PRIMARY KEY,
      name varchar(225),
      description varchar(225)
    );

    CREATE TABLE Planets(
      id serial PRIMARY KEY,
      name varchar(225),
      moons int
    );

    CREATE TABLE Heroes(
      id serial PRIMARY KEY,
      planet_id int REFERENCES planets ON DELETE SET NULL,
      race_id int REFERENCES races ON DELETE SET NULL,
      alias varchar(225),
      level int
    );

    CREATE TABLE Planets_Races(
      planet_id int REFERENCES planets ON DELETE SET NULL,
      race_id int REFERENCES races ON DELETE SET NULL
    );
  `)
};

exports.down = function(knex, Promise) {
  return knex.raw(`
    DROP TABLE Heroes CASCADE;
    DROP TABLE Races CASCADE;
    DROP TABLE Planets CASCADE;
    DROP TABLE Planets_Races CASCADE;
  `)
};
