const postModel = require("../models/Post");
const PostService = require("../services/PostService");

class PostController {

    constructor() {
        this.postService = new PostService();
    }

    async index(req, res) {
        const data = await this.postService.index();
        res.status(data.statusCode).json(data);
    }

    async create(req, res) {
        const data = await this.postService.create(req, res);
        res.status(data.statusCode).json(data);
    }
}

module.exports = PostController;
