const postModel = require('../models/Post');
const BaseService = require('./BaseService');
const { ResponseBuilder } = require('./ResponseBuilder');

module.exports = class extends BaseService {

  constructor() {
    super();
    this.responseBuilder = new ResponseBuilder();
  }

  async index(req) {
    try {
      const { orderBy, value } = req.query;

      const posts = orderBy
        ? await postModel.find({}).sort([[orderBy, value]]).exec()
        : await postModel.find().sort({ createdAt: -1 });

      let filteredPosts = posts.map(post => {
        return {
          title: post.title,
          body: post.body,
          created: post.createdAt
        };
      });

      return this.responseBuilder
                 .setData({
                   posts: filteredPosts
                 })
                 .generateResponse();

    } catch(error) {
      return this.responseBuilder
                 .setSuccess(false)
                 .setStatus(500)
                 .setData(error)
                 .generateResponse();
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

      return this.responseBuilder
                 .setStatus(201)
                 .setData({
                   post: {
                     title: post.title,
                     body: post.body,
                     image: post.image,
                     created: post.createdAt
                   }
                 })
                 .generateResponse();
    } catch(error) {
      return this.responseBuilder
                 .setSuccess(false)
                 .setStatus(500)
                 .setData(error)
                 .generateResponse();
    }
  };
};
