const postModel = require('../models/Post');
const BaseService = require('./BaseService');
const fs = require('fs');

module.exports = class extends BaseService {

  constructor() {
    super();
  }

  async index(req) {
    try {
      const { orderBy } = req.query;

      const [field, sort] = (orderBy || 'createdAt:-1').split(':');

      const posts = await postModel.find({}).sort([[field, sort]]).exec();

      let filteredPosts = posts.map(post => {
        return {
          id: post._id,
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
      if(errors.hasErrors) { 
        return errors.body; 
      }

      const { title, body } = req.body;

      const post = await postModel.create({
        title,
        body, 
        image: (req.file && req.file.filename) || null
      });

      return this.responseBuilder
                 .setStatus(201)
                 .setData({
                   post: {
                     id: post._id,
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

  async show(req) {
    try {
      const { id } = req.query;

      if(id) {
        const post = await postModel.findOne({ _id: id });

        if(!post) {
          return this.responseBuilder
                     .setSuccess(false)
                     .setMessage('Post not found')
                     .setStatus(404)
                     .generateResponse();
        }

        return this.responseBuilder
                   .setData({
                     id: post.id,
                     title: post.title,
                     body: post.body,
                     created: post.createdAt
                   })
                   .generateResponse();
      }

      return  this.responseBuilder
                  .setSuccess(false)
                  .setMessage('Post ID is reuired')
                  .setStatus(400)
                  .generateResponse();
      
    } catch(error) {
      return this.responseBuilder
                 .setSuccess(false)
                 .setStatus(500)
                 .setData(error)
                 .generateResponse();
    }
  };

  async delete(req) {
    try {
      const { id } = req.body;

      if(id) {
        await postModel.deleteOne({ _id: id }).exec();

        return this.responseBuilder
                   .setMessage("Deleted")
                   .generateResponse();
      }

       return  this.responseBuilder
                  .setSuccess(false)
                  .setMessage('Post ID is reuired')
                  .setStatus(400)
                  .generateResponse();

    } catch(error) {
      return this.responseBuilder
                 .setStatus(500)
                 .setData(error)
                 .setSuccess(false)
                 .generateResponse();
    }
  }

  async update(req) {
    try {
      const { title, body } = req.body;
      const { id } = req.query;

      if(!id) {
         return  this.responseBuilder
                  .setSuccess(false)
                  .setMessage('Post ID is reuired')
                  .setStatus(400)
                  .generateResponse();

      }

      const post = await postModel.findOne({ id });

      if(post && post.image) {
        fs.unlinkSync('public/images/' + post.image);
      }

      await postModel.findOneAndUpdate({ id }, {
          title,
          body,
          image: (req.file && req.file.filename) || null
        }
      );

      return this.responseBuilder
                 .setMessage('Post updated successfully')
                 .generateResponse();

    } catch(error) {
      return this.responseBuilder
                 .setSuccess(false)
                 .setStatus(500)
                 .setData(error)
                 .generateResponse();
    }
  }
};
