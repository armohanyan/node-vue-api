const Post = require("../models/Post");
    
class PostController {

    // get posts
    static async getPosts(req, res) {
        let posts = await Post.find();  

        res.status(200).json({
            success: true,
            data: posts,
            message: ""
        });
    }
}

module.exports = PostController;
