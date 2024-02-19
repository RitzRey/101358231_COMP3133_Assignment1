const express = require('express');
const mongoose = require('mongoose');

const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const employeeResolvers = require('./employeeResolver');
const userResolver = require('./userResolver');

const startServer = async () => {
  mongoose.connect('mongodb+srv://reyritz2224:adminpass@cluster0.ehvajcf.mongodb.net/comp3133_assigment1?retryWrites=true&w=majority', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  });

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB!');
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers: [employeeResolvers],
  });

  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/graphql`);
  });
};

startServer();
