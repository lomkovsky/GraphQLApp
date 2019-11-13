import { GraphQLServer } from 'graphql-yoga';
import db from './db';
import Query from './Resolvers/Query';
import Mutation from './Resolvers/Mutation';
import Post from './Resolvers/Post';
import User from './Resolvers/User';
import Comment from './Resolvers/Comment';


const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Post,
    User,
    Comment,
  },
  context: {
    db,
  },
});

server.start(() => {
  console.log('The server is up');
});
