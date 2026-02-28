/**
 * Blog Post Model
 * Defines the Mongoose schema for blog posts
 */

const mongoose = require('mongoose');

/**
 * Post Schema
 * Defines the structure for blog post documents
 */
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    minlength: [10, 'Content must be at least 10 characters long']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    minlength: [2, 'Author name must be at least 2 characters long'],
    maxlength: [50, 'Author name cannot exceed 50 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Schema options
  timestamps: true, // Adds createdAt and updatedAt fields
  versionKey: false // Removes __v field
});

/**
 * Index for better query performance
 * Creates an index on createdAt for sorting posts by date
 */
postSchema.index({ createdAt: -1 });

/**
 * Transform output when converting to JSON
 * Removes sensitive or unnecessary fields
 */
postSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

// Create and export the Post model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
