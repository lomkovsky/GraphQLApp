import { Prisma } from 'prisma-binding';
const prisma = new Prisma({
  typeDefs: './src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
});
// (async() => {
//   const data = await prisma.query.users(null, '{ id name email posts { id } comments { id } }')
//   const parsedData = JSON.parse(JSON.stringify(data));
//   console.log(parsedData);
// })()

// (async() => { const data = await prisma.query.comments(null, '{ id text author { name } }');
// const parsedData = JSON.parse(JSON.stringify(data));
//   console.log(parsedData);
// })();

// (async () => {
//   const data = await prisma.mutation.createUser({
//     data: {
//       name: 'Sarah',
//       email: "Sarah@exemple.io"
//     }
//   },
//     '{ id  name }');
//   const parsedData = JSON.parse(JSON.stringify(data));
//   console.log(parsedData);
// })();

// (async () => {
//   const data = await prisma.mutation.createPost({
//     data: {
//       title: 'Sarah first post title',
//       body: 'Sarah first post body',
//       author: {
//         connect: {
//           id: "ck3491ogh00ee0792k7eiyear"
//         }
//       }
//     }
//   },
//     '{ id  title body author { name }}');
//   const parsedData = JSON.parse(JSON.stringify(data));
//   console.log(parsedData);
// })();

// (async () => {
//   const data = await prisma.mutation.updatePost({
//     data: {
//       published: false
//     },
//     where: {
//       id: "ck349qcox00hu0792iipmwd33"
//     }
//   },
//     '{ id  title body published author { name }}');
//   // const parsedData = JSON.parse(JSON.stringify(data));
//   // console.log(parsedData);
//   const data2 = await prisma.query.posts(null, '{ id  title body published author { name } }');
//   const parsedData = JSON.parse(JSON.stringify(data2));
//   console.log(parsedData)
// })();

// (async() => { const data = await prisma.query.posts(null, '{ id  title body published author { name } }');
// const parsedData = JSON.parse(JSON.stringify(data));
//   console.log(parsedData);
// })();

const createPostForUser = async (userId, data) => {
  const userExist = await prisma.exists.User( { id: userId });
  if (!userExist) {
    throw new Error('User not found!')
  }
  const post = await prisma.mutation.createPost({
    data: {
      ...data,
      author: {
        connect: {
          id: userId
        }
      }
    }
  }, '{ author { id name posts { id title published} } }');
  const parsedData = JSON.parse(JSON.stringify(post.author));
  return parsedData
}

// createPostForUser('ck3491ogh00ee0792k7eiyear', {
//   title: "title sarah`s post",
//   body: "boby sarah`s post",
//   published: true
// }).then((user) => {
//   console.log(user);
// }).catch((error) => {
//   console.log(error.message)
// });

const updatePostForUser = async (postId, data) => {
  const postExist = await prisma.exists.Post({ id: postId });
  if (!postExist) {
    throw new Error ('Post not found!')
  }
  const post = await prisma.mutation.updatePost({
    data: {
      ...data
    },
    where: {
        id: postId
      }
  }, '{ author { id name posts { id title published } } }');
  const parsedData = JSON.parse(JSON.stringify(post.author));
  return parsedData
}
// updatePostForUser('ck34f7zyh01al0792fqvxd6el', {
//   published: true,
//   title: 'new title'
// }).then((user) => {
//   console.log(user);
// }).catch((error) => {
//   console.log(error.message)
// });;