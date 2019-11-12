import { GraphQLServer } from 'graphql-yoga';

// users data
const Users = [{
  id: '1',
  name: 'lom',
  email: 'lom@email.com',
  age: 36,
}, {
  id: '2',
  name: 'bob',
  email: 'bob@email.com',
  age: 35,
}, {
  id: '3',
  name: 'zed',
  email: 'zed@email.com',
}];
// posts data
const Posts = [{
  id: "1ID",
  title: "one",
  body: "one body",
  published: true,
  author: "1",
}, {
  id: "2ID",
  title: "two",
  body: "two body",
  published: false,
  author: "1",
}, {
  id: "3ID",
  title: "three",
  body: "three body",
  published: true,
  author: "2",
}]

// comments data
const Comments = [{
  id: "Com1",
  text: "comment number 1",
  author: "2",
  post: "3ID",
}, {
  id: "Com2",
  text: "comment number 2",
  author: "1",
  post: "2ID",
}, {
  id: "Com3",
  text: "comment number 3",
  author: "3",
  post: "3ID",
}, {
  id: "Com4",
  text: "comment number 4",
  author: "2",
  post: "3ID",
},]

// Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    me: User!
    posts(published: Boolean): [Post!]!
    post: Post!
    comments: [Comment!]!
  }
  type User{
    id: ID!
    name: String!
    age: Int
    email: String!
    posts: [Post!]!
    comments: [Comment!]!
  }
  type Post{
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }
  type Comment{
    id: ID!
    text: String!
    author: User
    post: Post!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return Users;;
      }
      return Users.filter((user) => {
        return user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase());
      });
    },
    posts(parent, args, ctx, info) {
      if (args.published === undefined) {
        return Posts;
      }
      return Posts.filter((post) => {
        return post.published === args.published
      });
    },
    comments(parent, args, ctx, info) {
      return Comments;
    },
    me() {
      return {
        id: "1234ID",
        name: "Jone",
        age: 18,
        email: "jone@example.com",
      };
    },
    post() {
      return {
        id: "123ID",
        title: "String",
        body: "String",
        published: true,
        author: "3",
      }
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return Users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return Comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return Posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return Comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return Users.find((user) => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return Posts.find((post) => {
        return post.id === parent.post;
      });
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log('The server is start');
});
