const postModel = require('../models/Post');
const BaseService = require('./BaseService');
const fs = require('fs');

module.exports = class extends BaseService {
  constructor() {
    super();
  }

  async filterPosts(req) {
    try {
      const { orderBy } = req.query;

      const [field, sort] = (orderBy || 'createdAt:-1').split(':');

      const posts = await postModel
        .find({})
        .sort([[field, sort]])
        .exec();

      let filteredPosts = posts.map((post) => {
        return {
          id: post._id,
          title: post.title,
          body: post.body,
          img: post.image,
          created: post.createdAt
        };
      });

      return this.response({
        data: {
          posts: filteredPosts
        }
      });

    } catch(error) {
      return this.serverErrorResponse(error)
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

      return this.response({
        statusCode: 201,
        data: {
          post: {
            id: post._id,
            title: post.title,
            body: post.body,
            image: post.image,
            created: post.createdAt
          }
        }
      });

    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }

  async show(req) {
    try {
      const { id } = req.params;

      if(id) {
        const post = await postModel.findOne({ _id: id });

        if(!post) {
          return this.response({
            status: false,
            statusCode: 400,
            message: 'Post does not found'
          });
        }

        return this.response({
          data: {
            post: {
              id: post.id,
              title: post.title,
              body: post.body,
              img: post.image,
              created: post.createdAt
            }
          }
        });
      }

      return this.response({
        status: false,
        statusCode: 400,
        message: 'Post ID is required'
      });
    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }

  async delete(req) {
    try {
      const { id } = req.body;

      if(id) {

        const post = await postModel.findOne({ _id: id });

        if(post && post.image) {
          if (fs.existsSync('public/images/' + post.image)) {
            fs.unlinkSync('public/images/' + post.image);
          }
        }

        await postModel.deleteOne({ _id: id }).exec();

        return this.response({
          status: false,
          message: 'Deleted'
        });
      }

      return this.response({
        status: false,
        statusCode: 400,
        message: 'Post ID is required'
      });
    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }

  async update(req) {
    try {

      const errors = this.handleErrors(req);

      if(errors.hasErrors) {
        return errors.body;
      }

      const { title, body, id } = req.body;

      if(!id) {
        return this.response({
          status: false,
          statusCode: 400,
          message: 'Post ID is required'
        });
      }
      const post = await postModel.findOne({ _id: id });

      if(req.file) {

        if(post && post.image) {
          if (fs.existsSync('public/images/' + post.image)) {
            fs.unlinkSync('public/images/' + post.image);
          }
        }
      }

      await postModel.findOneAndUpdate(
        { _id: id },
        {
          title,
          body,
          image: (req.file && req.file.filename) || post.image
        }
      );

      return this.response({
        message: 'Post updated successfully'
      });

    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }
};
