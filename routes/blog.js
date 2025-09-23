const express = require("express");
const { blogController } = require("../controllers");
const blogRouter = express.Router();
const validate = require("../validators/validate");
const { isAuthMiddleware } = require("../middlewares");
const { postValidator, commentValidator } = require("../validators/blog");

blogRouter.get("/categories", isAuthMiddleware, blogController.listCategory);
blogRouter.get("/tags", isAuthMiddleware, blogController.listTags);
blogRouter.post(
  "/posts",
  isAuthMiddleware,
  postValidator,
  validate,
  blogController.createBlog
);
blogRouter.get("/posts", isAuthMiddleware, blogController.listBlog);
blogRouter.put(
  "/posts/:post_id",
  isAuthMiddleware,
  postValidator,
  validate,
  blogController.updateBlog
);
blogRouter.get("/posts/:post_id", isAuthMiddleware, blogController.singleBlog);

blogRouter.delete(
  "/posts/:post_id",
  isAuthMiddleware,
  blogController.deleteBlog
);

blogRouter.post(
  "/posts/:post_id/comments",
  isAuthMiddleware,
  commentValidator,
  validate,
  blogController.blogComment
);

blogRouter.delete(
  "/posts/:post_id/comments/:comment_id",
  isAuthMiddleware,
  blogController.deleteBlogComment
);

blogRouter.get(
  "/posts/:post_id/comments",
  isAuthMiddleware,
  blogController.fetchBlogComment
);

module.exports = blogRouter;
