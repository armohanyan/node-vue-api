const PostsController  = require("../controllers/PostsController");
const { requireAuth, requireAdmin } = require("../middlwares/AuthMiddlware");
const { Router } = require('express');
const upload = require("../middlwares/UploadFile");

// Validators
const CreatePostValidation = require('../common/validation/CreatePostValidation');

const postController = new PostsController();
const router = Router();

router.get("/", requireAuth,  postController.index.bind(postController));
router.delete("/", requireAdmin,  postController.delete.bind(postController));
router.post("/", requireAdmin, upload.single("file"), CreatePostValidation, postController.create.bind(postController));
router.get("/show/", requireAuth,  postController.show.bind(postController));

module.exports = router;
