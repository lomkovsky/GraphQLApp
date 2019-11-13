const Query = {
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }
    return db.users.filter((user) => {
      return user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase());
    });
  },
  posts(parent, args, { db }, info) {
    if (args.published === undefined) {
      return db.posts;
    }
    return db.posts.filter((post) => {
      return post.published === args.published
    });
  },
  comments(parent, args, { db }, info) {
    return db.comments;
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
export { Query as default};
