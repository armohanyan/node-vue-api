const PostsController  = require("../controllers/PostsController");
const { requireAuth } = require("../middlwares/AuthMiddlware");
const { Router } = require('express');
const upload = require("../middlwares/UploadFile");

// Validation

const CreatePostValidation = require('../common/validation/CreatePostValidation');

const postController = new PostsController();
const router = Router();

router.get("/", requireAuth,  postController.index.bind(postController));
router.post("/", requireAuth, upload.single("file"),  CreatePostValidation, postController.create.bind(postController));

module.exports = router;
