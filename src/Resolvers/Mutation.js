import uuidv4 from 'uuid/v4';

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => user.email === args.data.email)
    if (emailTaken) {
      throw new Error('Email taken!');
    }
    const user = {
      id: uuidv4(),
      ...args.data,
    };
    db.users.push(user);
    return user;
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id == args.id)
    if (userIndex === -1) {
      throw new Error('User not found!');
    }
    const deletedUser = db.users.splice(userIndex, 1)
    db.posts = db.posts.filter((post) => {
      const match = post.author == args.id
      if (match) {
        db.comments = db.comments.filter((comment) => post.id !== comment.post);
      }
      return !match
    });
    db.comments = db.comments.filter((comment) => comment.author !== args.id)
    return deletedUser[0]
  },
  updateUser(parent, args, { db }, info) {
    const user = db.users.find((user) => user.id == args.id)
    if (!user) {
      throw new Error('User not found!');
    }
    if (typeof args.data.email === 'string') {
      const emailTaken = db.users.some((user) => user.email === args.data.email)
      if (emailTaken) {
        throw new Error('Email taken!');
      }
      user.email = args.data.email;
    }
    if (typeof args.data.name === 'string') {
      user.name = args.data.name;
    }
    if (typeof args.data.age !== 'undefined') {
      user.age = args.data.age;
    }
    return user;
  },
  createPost(parent, args, { db }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author)
    if (!userExists) {
      throw new Error('User is not exist!');
    }
    const post = {
      id: uuidv4(),
      ...args.data,
    };
    db.posts.push(post);
    return post;
  },
  deletePost(parent, args, { db }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);
    if (postIndex === -1) {
      throw new Error('Post not found!')
    }
    const postsDeleted = db.posts.splice(postIndex, 1)
    db.comments = db.comments.filter((comment) => comment.post !== args.id)
    return postsDeleted[0]
  },
  updatePost(parent, args, { db }, info) {
    const post = db.posts.find((post) => post.id === args.id)
    if (!post) {
      throw new Error('Post is not exist!');
    }
    if (typeof args.data.title === 'string') {
      post.title = args.data.title;
    }
    if (typeof args.data.body === 'string') {
      post.body = args.data.body;
    }
    if (typeof args.data.published === 'boolean') {
      post.published = args.data.published;
    }
    return post;
  },
  createComment(parent, args, { db }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);;
    const postExist = db.posts.some((post) => post.id === args.data.post && post.published);
    if (!userExists || !postExist) {
      throw new Error('User is not exist! or Post is not exist or not published!');
    }
    const comment = {
      id: uuidv4(),
      ...args.data,
    };
    db.comments.push(comment);
    return comment;
  },
  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)
    if (commentIndex === -1) {
      throw new Error('Comment not found!')
    }
    const commentDeleted = db.comments.splice(commentIndex, 1);
    return (commentDeleted[0]);
  },
  updateComment(parent, args, { db }, info) {
    const comment = db.comments.find((comment) => comment.id === args.id)
    if (!comment) {
      throw new Error('Comment is not exist!');
    }
    if (typeof args.data.text === 'string') {
      comment.text = args.data.text;
    }
    return comment;
  },
};
export { Mutation as default };
