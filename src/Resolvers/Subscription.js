const Subscription = {
  comment: {
    subscribe(parent, { PostId }, { db, pubsub }, info) {
      const post = db.posts.find((post) => post.id === PostId && post.published);
      if (!post) {
        throw new Error('Post not found!');
      }

      return pubsub.asyncIterator(`comment ${PostId}`);
    },
  },
  post: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator('post');
    },
  },
};
export { Subscription as default };