const postModel = require('../models/Post');
const BaseService = require('./BaseService');

module.exports = class extends BaseService {

  constructor() {
    super();
  }

  async index() {

    try {
      const posts = await postModel.find().sort( { createdAt: -1 } );

      let filteredPosts = posts.map(post => {
        return {
          title: post.title,
          body: post.body,
          created: post.createdAt,
        }
      })

      return this.responseMessage({
        statusCode: 200,
        data: {
          posts : filteredPosts
        }
      });

    } catch(error) {
      return this.responseMessage({
        statusCode: 500,
        data: error
      });
    }

  }

  async create(req) {
    try {

      const errors = this.handleErrors(req);
      if(errors.hasErrors) { return errors.body; }

      const { title, body } = req.body;

      const post = await postModel.create({
        title,
        body,
        image: req.file ? req.file.filename : null
      });

      return this.responseMessage({
        statusCode: 201,
        data: {
            post: {
              title: post.title,
              body: post.body,
              image: post.image,
              created: post.createdAt
            }
        }
      })

    } catch(error) {
      return this.responseMessage({
        statusCode: 500,
        success: false,
        data: error
      })
    }
  }
};
