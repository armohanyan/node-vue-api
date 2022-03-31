const PostsController  = require("../controllers/PostsController");
const { roleAuth } = require("../middlwares/RoleMiddlware");
const { requireAuth } = require("../middlwares/AuthMiddlware");
const { Router } = require('express');
const upload = require("../middlwares/UploadFile");

// Validators
const CreatePostValidation = require('../common/validation/CreatePostValidation');

const postController = new PostsController();
const router = Router();

router.get("/", requireAuth,  postController.index.bind(postController));
router.delete("/", roleAuth("admin"),  postController.delete.bind(postController));
router.post("/", roleAuth("basic", "admin"), upload.single("file"), CreatePostValidation, postController.create.bind(postController));
router.get("/show/", requireAuth,  postController.show.bind(postController));

module.exports = router;
