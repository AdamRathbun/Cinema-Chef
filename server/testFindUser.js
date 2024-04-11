const userModel = require('./auth/userModel'); // Update the path accordingly

const testFindUserByUsername = async () => {
  const usernameToFind = 'testuser';

  try {
    const foundUser = await userModel.findUserByUsername(usernameToFind);
  } catch (error) {
    console.error('Error finding user:', error.message);
  } finally {
    // Close the database connection if necessary
    // await pool.end();
  }
};

testFindUserByUsername();
