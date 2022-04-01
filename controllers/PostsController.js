const PostService = require("../services/PostService");

class PostController {
  constructor() {
    this.postService = new PostService();
  }

  async filterPosts(req, res) {
    const data = await this.postService.filterPosts(req);
    res.status(data.statusCode).json(data);
  }

  async create(req, res) {
    const data = await this.postService.create(req);
    res.status(data.statusCode).json(data);
  }

  async show(req, res) {
    const data = await this.postService.show(req);
    res.status(data.statusCode).json(data);
  }

  async delete(req, res) {
    const data = await this.postService.delete(req);
    res.status(data.statusCode).json(data);
  }

  async update(req, res) {
    const data = await this.postService.update(req);
    res.status(data.statusCode).json(data);
  }
}

module.exports = PostController;
