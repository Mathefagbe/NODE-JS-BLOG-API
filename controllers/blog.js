const slugify = require("slugify");
const {
  categoryModel,
  tagsModel,
  postModel,
  commentModel,
} = require("../models");
const AppError = require("../utils/appError");

const listCategory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const categories = await categoryModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await categoryModel.countDocuments();
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      meta_data: {
        limit: limit,
        page: page,
        totalItem: total,
        totalPages: totalPages,
      },
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

const listTags = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const tags = await tagsModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await tagsModel.countDocuments();
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
      success: true,
      message: "Tag fetched successfully",
      meta_data: {
        limit: limit,
        page: page,
        totalItem: total,
        totalPages: totalPages,
      },
      data: tags,
    });
  } catch (error) {
    next(error);
  }
};

const createBlog = async (req, res, next) => {
  try {
    const { title, description, category_id, tags_ids, status } = req.body;
    const user = req.user;
    const post = new postModel({
      author: user._id,
      title: title,
      description: description,
      category: category_id,
      status: status,
      tags: tags_ids,
    });

    await post.save();
    res.status(201).json({
      success: true,
      message: "blog saved successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

const singleBlog = async (req, res, next) => {
  try {
    const id = req.params.post_id;

    const post = await postModel
      .findById(id)
      .populate("author", "-password -__v")
      .populate("category", "-__v")
      .populate("tags", "-__v")
      .select("-__v")
      .lean();
    const count = await commentModel.countDocuments({ post: post._id });
    const postsWithCommentCount = {
      ...post,
      commentCount: count,
    };

    if (post.author._id !== req.user._id)
      throw new AppError("Permission Denied", 403);

    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      data: postsWithCommentCount,
    });
  } catch (error) {
    next(error);
  }
};

const listBlog = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;

    let filter = {};

    if (search) {
      filter = {
        title: { $regex: search, $options: "i" },
      };
    }
    const posts = await postModel
      .find(filter)
      .populate("author", "-password -__v")
      .populate("category", "-__v")
      .populate("tags", "-__v")
      .select("-__v")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort("-createdAt")
      .lean();

    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const count = await commentModel.countDocuments({ post: post._id });
        return { ...post, commentCount: count };
      })
    );
    const total = await postModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      meta_data: {
        limit: limit,
        page: page,
        totalItem: total,
        totalPages: totalPages,
      },
      data: postsWithCommentCount,
    });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const { title, description, category_id, tags_ids, status } = req.body;
    const id = req.params.post_id;

    const post = await postModel.findById(id);

    if (post.author._id !== req.user._id)
      throw new AppError("Permission Denied", 403);

    post.title = title;
    post.description = description;
    post.category = category_id;
    post.tags = tags_ids;
    post.status = status;

    await post.save();
    res.status(201).json({
      success: true,
      message: "blog updated successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const id = req.params.post_id;
    const post = await postModel.findById(id);
    if (post.author._id !== req.user._id)
      throw new AppError("Permission Denied", 403);

    await post.deleteOne();
    res.status(201).json({
      success: true,
      message: "blog deleted successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

const blogComment = async (req, res, next) => {
  try {
    const { comment } = req.body;
    const post_id = req.params.post_id;
    const comments = new commentModel({
      author: req.user,
      post: post_id,
      comment: comment,
    });
    await comments.save();
    res.status(201).json({
      success: true,
      message: "comment saved successfully",
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

const fetchBlogComment = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const post_id = req.params.post_id;

    const comments = await commentModel
      .find({ post: post_id })
      .populate("author", "-password -__v")
      .select("-__v")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await commentModel.countDocuments();
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
      success: true,
      message: "Comment fetched successfully",
      meta_data: {
        limit: limit,
        page: page,
        totalItem: total,
        totalPages: totalPages,
      },
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBlogComment = async (req, res, next) => {
  try {
    const id = req.params.comment_id;
    const comment = await commentModel.findById(id);
    if (comment.author._id !== req.user._id)
      throw new AppError("Permission Denied", 403);

    await comment.deleteOne();
    res.status(201).json({
      success: true,
      message: "comment deleted successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBlog,
  listBlog,
  listCategory,
  deleteBlog,
  updateBlog,
  singleBlog,
  blogComment,
  fetchBlogComment,
  deleteBlogComment,
  listTags,
};
