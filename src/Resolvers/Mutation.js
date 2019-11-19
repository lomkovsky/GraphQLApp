import uuidv4 from 'uuid/v4';
import { argsToArgsConfig } from 'graphql/type/definition';

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });
    if (emailTaken) {
      throw new Error('Email taken!');
    }
    return prisma.mutation.createUser({
      data: args.data
    },
      info
    );
  },

  async deleteUser(parent, args, { prisma }, info) {
    const userExist = await prisma.exists.User({ id: args.id });
    if (!userExist) {
      throw new Error('User not found!');
    }
    return prisma.mutation.deleteUser({
      where: {
        id: args.id
      }
    },
      info
    );
  },

  async updateUser(parent, args, { prisma }, info) {
    const userExist = await prisma.exists.User({ id: args.id });
    if (!userExist) {
      throw new Error('User not found!');
    }
    return prisma.mutation.updateUser({
      where: {
        id: args.id
      },
      data: args.data,
    },
      info
    );
  },

  async createPost(parent, args, { prisma }, info) {
    const userExist = await prisma.exists.User({ id: args.data.author });
    if (!userExist) {
      throw new Error('User not found!');
    }
    return prisma.mutation.createPost({
      data: {
        ...args.data,
        author: {
          connect: {
            id: args.data.author
          }
        }
      }
    },
      info
    );
  },

  async deletePost(parent, args, { prisma }, info) {
    const postExist = await prisma.exists.Post({ id: args.id });
    if (!postExist) {
      throw new Error('Post not found!');
    }
    return prisma.mutation.deletePost({
      where: {
        id: args.id
      }
    },
      info
    )
  },

  async updatePost(parent, args, { prisma }, info) {
    const postExist = await prisma.exists.Post({ id: args.id });
    if (!postExist) {
      throw new Error('Post not found!');
    }
    return prisma.mutation.updatePost({
      where: {
        id: args.id
      },
      data: args.data
    },
      info
    )
  },

  async createComment(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: args.data.author });
    const postExist = await prisma.exists.Post({ id: args.data.post });
    const post = await prisma.query.posts({ where: { id: args.data.post } });
    if (!userExists || !postExist) {
      throw new Error('User is not exist! or Post is not exist');
    }
    if (post[0].published === false) {
      throw new Error('Post is not published!');
    }
    return prisma.mutation.createComment({
      data: {
        text: args.data.text,
        author: {
          connect: { id: args.data.author }
        },
        post: {
          connect: { id: args.data.post }
        }
      }
    },
      info
    )
  },

  async deleteComment(parent, args, { prisma }, info) {
    const commentExist = await prisma.exists.Comment({ id: args.id })
    if (!commentExist) {
      throw new Error('Comment not found!')
    }
    return prisma.mutation.deleteComment({
      where: {
        id: args.id
      }
    },
      info
    )
  },

  async updateComment(parent, args, { prisma }, info) {
    const commentExist = await prisma.exists.Comment({ id: args.id })
    if (!commentExist) {
      throw new Error('Comment not found!')
    }
    return prisma.mutation.updateComment({
      where: {
        id: args.id
      },
      data: args.data
    },
      info
    )
  },

};
export { Mutation as default };
