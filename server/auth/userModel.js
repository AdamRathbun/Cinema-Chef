const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const supabase = createClient(config.supabaseURL, config.supabaseKey);

const createUser = async (userData) => {
  const { username, password } = userData;

  try {
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{ username, password }])
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    return newUser;
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw error;
  }
};

const findUserByUsername = async (username) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }

    return users[0];
  } catch (error) {
    console.error('Error finding user by username:', error.message);
    throw error;
  }
};

module.exports = {
  createUser,
  findUserByUsername,
};
