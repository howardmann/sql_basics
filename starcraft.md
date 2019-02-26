# Starcraft

## Table and associations
- Database: Starcraft
- Tables: `Races`, `Planets`, `Planets_Races` (join table), `Heroes`
- Associations:
  - `Races` many-to-many `Planets` 
    - 1 planet can be controlled by many races and similarly 1 race can control many planets)
  - `Races` one-to-many `Heroes`
    - 1 race has many heroes but 1 hero can only belong to a single race (no biracial)
  - `Planets` one-to-many `Heroes`
    - 1 planet can give birth to many heroes but 1 hero can only be born in a single homeworld 

![relational db](/draw.png)

## Postgresql commands
Create database. Ensure postgresql application is running
```bash
# run postgresql in terminal
psql
# create database
CREATE DATABASE {database_name};
# connect to database
\c {database_name}

# other useful terminal commands
\c {database_name}# connect to [database] 
\l # list all databases
\dt #list all tables in current database
\d {table_name} #list schema of table
```
## Create Tables

```sql
CREATE TABLE Races (
    id serial PRIMARY KEY,
    name varchar(225),
    description varchar(225)
);

CREATE TABLE Planets (
    id serial PRIMARY KEY,
    name varchar(225),
    moons int
);

CREATE TABLE Heroes (
    id serial PRIMARY KEY,
    planet_id int REFERENCES planets,
    race_id int REFERENCES races,
    alias varchar(225),
    level int
);

CREATE TABLE Planets_Races (
    planet_id int REFERENCES planets,
    race_id int REFERENCES races
);
```

## Seed Database
Seed `races`
```sql
-- Delete existing data
DELETE FROM Races;
-- RESET SERIAL PRIMARY KEY
ALTER SEQUENCE races_id_seq RESTART WITH 1;
-- SEED NEW DATA
INSERT INTO Races (id, name, description) VALUES
(1, 'Zerg', 'Eats humans'),
(2, 'Terran', 'Marine hoorah'),
(3, 'Protoss', 'For Aiur'),
(4, 'Xel Naga', '...');
```

Seed `planets`
```sql
-- Delete existing data
DELETE FROM Planets;
-- RESET SERIAL PRIMARY KEY
ALTER SEQUENCE planets_id_seq RESTART WITH 1;
-- SEED NEW DATA
INSERT INTO Planets (id, name, moons) VALUES
(1, 'Char', 0),
(2, 'Earth', 1),
(3, 'Aiur', 6),
(4, 'Korhal', 3);

```

Associate `planets` to `races`. Zerg controls Char (1,1) and shares control of Earth (2,1). Terran controls Korhal (4,2) and shares control of Earth (2,2). Protoss control Aiur (3,3).
```sql
-- Delete existing data
DELETE FROM Planets_Races;
-- SEED NEW DATA
INSERT INTO Planets_Races (planet_id, race_id) VALUES
(1, 1),
(2, 1),
(4, 2),
(2, 2),
(3, 3);
```

Seed `heroes` and associate them with planets and races
```sql
-- Delete existing data
DELETE FROM heroes;
-- RESET SERIAL PRIMARY KEY
ALTER SEQUENCE heroes_id_seq RESTART WITH 1;
-- SEED NEW DATA
INSERT INTO Heroes (id, planet_id, race_id, alias, level) VALUES
(1, 2, 2, 'Jim Raynor', 5),
(2, 1, 1, 'Queen of Blades', 20),
(3, 3, 3, 'Zeratul', 15),
(4, 4, 2, 'Arcturus Mensk', 5);
```

## QUERIES
Basic Queries
```sql
-- Find all planets
SELECT * FROM Planets;
-- id |  name  | moons
-- ----+--------+-------
--  1 | Char   |     0
--  2 | Earth  |     1
--  3 | Aiur   |     6
--  4 | Korhal |     3

-- Find all races only display id and name
SELECT id, name FROM Races;
-- id |   name
-- ----+----------
--  1 | Zerg
--  2 | Terran
--  3 | Protoss
--  4 | Xel Naga

-- Find all heroes
SELECT * FROM Heroes;
-- id | planet_id | race_id |      alias      | level
-- ----+-----------+---------+-----------------+-------
--  1 |         2 |       2 | Jim Raynor      |     5
--  2 |         1 |       1 | Queen of Blades |    20
--  3 |         3 |       3 | Zeratul         |    15
--  4 |         4 |       2 | Arcturus Mensk  |     5

-- Find all Heroes level 10 and above only displaying alias as "Boss Hero"
SELECT alias as "Boss Hero" , level FROM Heroes WHERE level > 10;
--    Boss Hero    | level
-- -----------------+-------
-- Queen of Blades |    20
-- Zeratul         |    15
```

INNER JOIN query: Race `has_many` Heroes
```sql
-- Find all heroes belonging to race:Terran
SELECT * 
FROM Heroes
INNER JOIN Races
ON Heroes.race_id = Races.id
WHERE Races.name = 'Terran';
-- id | planet_id | race_id |     alias      | level | id |  name  |  description
-- ----+-----------+---------+----------------+-------+----+--------+---------------
--  1 |         2 |       2 | Jim Raynor     |     5 |  2 | Terran | Marine hoorah
--  4 |         4 |       2 | Arcturus Mensk |     5 |  2 | Terran | Marine hoorah
```

INNER JOIN query: Race `has_and_belongs_to_many` Planets
```sql
-- Find all planets controlled by race: Zerg
SELECT *
FROM Planets
INNER JOIN Planets_Races
ON Planets.id = Planets_Races.planet_id
INNER JOIN Races
ON Planets_Races.race_id = Races.id
WHERE Races.name = 'Zerg';
-- id | name  | moons | planet_id | race_id | id | name | description
-- ----+-------+-------+-----------+---------+----+------+-------------
--  1 | Char  |     0 |         1 |       1 |  1 | Zerg | Eats humans
--   2 | Earth |     1 |         2 |       1 |  1 | Zerg | Eats humans

-- Find all races that control planet: Earth 
SELECT Races.id, Races.name as race_alias
FROM Races
INNER JOIN Planets_Races
ON Races.id = Planets_Races.race_id
INNER JOIN Planets
ON Planets_Races.planet_id = Planets.id
WHERE Planets.name = 'Earth';
-- id | race_alias
-- ----+------------
--  1 | Zerg
--  2 | Terran

```
