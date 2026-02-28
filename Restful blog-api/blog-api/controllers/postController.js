/**
 * Post Controller
 * Handles all CRUD operations for blog posts
 */

const Post = require('../models/Post');
const mongoose = require('mongoose');

/**
 * @desc    Create a new blog post
 * @route   POST /api/posts
 * @access  Public
 */
const createPost = async (req, res) => {
  try {
    // Extract data from request body
    const { title, content, author } = req.body;

    // Validate required fields
    if (!title || !content || !author) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, content, and author'
      });
    }

    // Create new post
    const post = await Post.create({
      title,
      content,
      author
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });

  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    // Handle other errors
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get all blog posts
 * @route   GET /api/posts
 * @access  Public
 */
const getAllPosts = async (req, res) => {
  try {
    // Build query
    const query = {};
    
    // Optional: Filter by author
    if (req.query.author) {
      query.author = { $regex: req.query.author, $options: 'i' };
    }

    // Optional: Search by title or content
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Execute query with pagination and sorting
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Post.countDocuments(query);

    // Return success response
    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: posts
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching posts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get a single blog post by ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format'
      });
    }

    // Find post by ID
    const post = await Post.findById(id);

    // Check if post exists
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Return success response
    res.status(200).json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update a blog post
 * @route   PUT /api/posts/:id
 * @access  Public
 */
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format'
      });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (author !== undefined) updateData.author = author;

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields provided for update'
      });
    }

    // Find and update post
    // runValidators ensures schema validations are applied
    // new: true returns the updated document
    const post = await Post.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    // Check if post exists
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });

  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    console.error('Error updating post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Delete a blog post
 * @route   DELETE /api/posts/:id
 * @access  Public
 */
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format'
      });
    }

    // Find and delete post
    const post = await Post.findByIdAndDelete(id);

    // Check if post exists
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      data: {}
    });

  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Export controller functions
module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
};
