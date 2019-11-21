import { Prisma } from 'prisma-binding';
import { fragmentReplacements } from './Resolvers/index';
const prisma = new Prisma({
  typeDefs: './src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
  secret: process.env.PRISMA_SECRET,
  fragmentReplacements,
});

export {prisma as default};
