const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({
  user: config.postgresUser,
  host: config.postgresHost,
  database: config.postgresDatabase,
  password: config.postgresPassword,
  port: config.postgresPort,
});

const createUser = async (userData) => {
  const { username, password } = userData;

  try {
    const query = 'INSERT INTO users(username, password) VALUES($1, $2) RETURNING *';
    const values = [username, password];

    const result = await pool.query(query, values);
    const newUser = result.rows[0];

    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

const findUserByUsername = async (username) => {
  try {
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];

    const result = await pool.query(query, values);
    const user = result.rows[0];

    return user;
  } catch (error) {
    console.error('Error finding user by username:', error);
    throw error;
  }
};

module.exports = {
  createUser,
  findUserByUsername,
};
