import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db';
import Query from './Resolvers/Query';
import Mutation from './Resolvers/Mutation';
import Post from './Resolvers/Post';
import User from './Resolvers/User';
import Comment from './Resolvers/Comment';
import Subscription from './Resolvers/Subscription';
import prisma from './prisma';

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    Post,
    User,
    Comment,
  },
  context: {
    db,
    pubsub,
    prisma,
  },
});

server.start(() => {
  console.log('The server is up');
});
