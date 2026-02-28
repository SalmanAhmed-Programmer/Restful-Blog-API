/**
 * Post Routes
 * Defines all API endpoints for blog post operations
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} = require('../controllers/postController');

/**
 * @route   POST /api/posts
 * @desc    Create a new blog post
 * @access  Public
 */
router.post('/', createPost);

/**
 * @route   GET /api/posts
 * @desc    Get all blog posts (with pagination and search)
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10)
 * @query   author - Filter by author name
 * @query   search - Search in title and content
 * @access  Public
 */
router.get('/', getAllPosts);

/**
 * @route   GET /api/posts/:id
 * @desc    Get a single blog post by ID
 * @access  Public
 */
router.get('/:id', getPostById);

/**
 * @route   PUT /api/posts/:id
 * @desc    Update a blog post by ID
 * @access  Public
 */
router.put('/:id', updatePost);

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete a blog post by ID
 * @access  Public
 */
router.delete('/:id', deletePost);

module.exports = router;
