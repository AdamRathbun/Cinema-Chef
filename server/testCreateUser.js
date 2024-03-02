const userModel = require('./auth/userModel');

const testCreateUser = async () => {
  const userData = {
    username: 'testuser',
    password: 'testpassword',
  };

  try {
    const newUser = await userModel.createUser(userData);
    console.log('User created:', newUser);
  } catch (error) {
    console.error('Error creating user:', error.message);
  } finally {
    // Close the database connection if necessary
    // await pool.end();
  }
};

testCreateUser();
