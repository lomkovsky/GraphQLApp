const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {};
    if (args.query) {
      opArgs.where = {
        OR: [{
          name_contains: args.query
        },
        {
          email_contains: args.query
        }]
      }
    }
    return prisma.query.users(opArgs, info);
  },
  posts(parent, args, { prisma }, info) {
    const opArgs = {};
    if (args.query) {
      opArgs.where = {
        OR: [{
          title_contains: args.query
        },
        {
          body_contains: args.query
        }],
      }
    }
    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
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
};
export { Query as default };
