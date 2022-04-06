const PostsController = require("../controllers/PostsController");
const { roleAuth } = require("../middlwares/RoleMiddlware");
const { requireAuth } = require("../middlwares/AuthMiddlware");
const { Router } = require("express");
const upload = require("../middlwares/UploadFile");

// Validators
const CreatePostValidation = require("../common/validation/CreatePostValidation");
const UpdatePostValidation = require("../common/validation/UpdatePostValidation");

const postController = new PostsController();
const router = Router();

router.get(
  "/",
  requireAuth,
  postController.filterPosts.bind(postController)
);

router.delete(
  "/",
  roleAuth("admin"),
  postController.delete.bind(postController)
);

router.post(
  "/",
  roleAuth("admin"),
  upload.single("file"),
  CreatePostValidation,
  postController.create.bind(postController)
);

router.get("/show/:id",
  requireAuth,
  postController.show.bind(postController)
);

router.put("/",
  requireAuth,
  upload.single("file"),
  UpdatePostValidation,
  postController.update.bind(postController)
);

module.exports = router;
