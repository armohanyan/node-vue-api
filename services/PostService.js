const postModel = require('../models/Post');

const BaseService = require('./BaseService');

module.exports = class extends BaseService {

  constructor() {
    super();
  }

  async index() {

    try {
      const posts = await postModel.find().skip(0).limit(5); // todo: make pagination

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
      if(errors.hasErrors) return errors.body;

      const { title, body } = req.body;

      await postModel.create({
        title,
        body
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
