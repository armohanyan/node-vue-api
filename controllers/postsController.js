const Post = require("../models/Post");
    
class PostController {

    // get posts
    static async getPosts() {
        let posts = await Post.find();  
        return {
            success: true,
            data: posts,
            message: ""
        };
    }
}
module.exports = PostController;

