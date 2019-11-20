import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getUserId from '../utils/getUserId';
import { privateDecrypt } from 'crypto';

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });
    // const token = jwt.sign({ id: '123' }, process.env.JWT_SECRET);
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded)
    if (emailTaken) {
      throw new Error('Email taken!');
    }
    if (args.data.password.length < 5) {
      throw new Error('password less than 5 characters')
    }
    args.data.password = await bcrypt.hash(args.data.password, 8);
    const user = await prisma.mutation.createUser({
      data: args.data
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    return {
      user,
      token
    }
  },


  async loginUser(parent, args, { prisma }, info) {
    const user = await prisma.query.user({ where: { email: args.data.email } });
    if(!user) {
      throw new Error('unable to authenticate please try again!');
    }
    const isMatch = await bcrypt.compare(args.data.password, user.password)
    if(!isMatch) {
      throw new Error('unable to authenticate please try again!');
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    return {
      user,
      token
    }
  },

  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    console.log(userId);
    return prisma.mutation.deleteUser({
      where: {
        id: userId
      }
    },
      info
    );
  },

  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    if (args.data.password) {
      if (args.data.password.length < 5) {
        throw new Error('password less than 5 characters')
      }
      args.data.password = await bcrypt.hash(args.data.password, 8);
    }
    return prisma.mutation.updateUser({
      where: {
        id: userId
      },
      data: args.data,
    },
      info
    );
  },

  async createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    console.log(userId);
    return prisma.mutation.createPost({
      data: {
        ...args.data,
        author: {
          connect: {
            id: userId
          }
        }
      }
    },
      info
    );
  },

  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExist = await prisma.exists.Post({ id: args.id, author: {id: userId} });
    if (!postExist) {
      throw new Error('Can`t delete Post!');
    }
    return prisma.mutation.deletePost({
      where: {
        id: args.id
      }
    },
      info
    )
  },

  async updatePost(parent, args, { prisma, request }, info) {
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
