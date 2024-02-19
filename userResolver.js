const UserModel = require('./models/Users');
const bcrypt = require('bcrypt');

const userResolvers = {
  Mutation: {
    signup: async (_, { input }) => {
      try {
        const { username, email, password } = input;

        console.log('Received signup input:', input);

        const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
          console.log('User with the same username or email already exists:', existingUser);
          throw new Error('User with the same username or email already exists.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({ username, email, password: hashedPassword });
        console.log('Saving new user to the database:', newUser);
        await newUser.save();

        console.log('User successfully saved to the database:', newUser);

        return {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
    
        };
      } catch (error) {
        console.error(`Signup failed: ${error.message}`);
        throw new Error(`Signup failed: ${error.message}`);
      }
    },
  },
  Query: {
    login: async (_, { input }) => {
      try {
        const { username, password } = input;

        console.log('Received login input:', input);

        const user = await UserModel.findOne({ username });

        if (!user) {
          console.log('User not found.');
          throw new Error('User not found.');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          console.log('Login successful:', user);
          return user;
        } else {
          console.log('Invalid password.');
          throw new Error('Invalid password.');
        }
      } catch (error) {
        console.error(`Login failed: ${error.message}`);
        throw new Error(`Login failed: ${error.message}`);
      }
    },
  },
};

module.exports = userResolvers;
