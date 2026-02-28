/**
 * Database Seeder
 * Populates the database with sample blog posts
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/Post');

// Sample blog posts data
const samplePosts = [
  {
    title: "Getting Started with Node.js",
    content: "Node.js is a powerful JavaScript runtime built on Chrome's V8 engine. It allows developers to run JavaScript on the server-side, enabling full-stack JavaScript development. In this comprehensive guide, we'll explore the fundamentals of Node.js, including its event-driven architecture, non-blocking I/O model, and the npm ecosystem. Understanding these concepts is crucial for building scalable and efficient web applications.",
    author: "Sarah Johnson"
  },
  {
    title: "Understanding RESTful API Design",
    content: "REST (Representational State Transfer) is an architectural style for designing networked applications. A well-designed RESTful API should be stateless, have a uniform interface, and use standard HTTP methods appropriately. This post covers best practices for API design including proper use of status codes, resource naming conventions, pagination strategies, and error handling patterns that make your APIs intuitive and developer-friendly.",
    author: "Michael Chen"
  },
  {
    title: "MongoDB Best Practices",
    content: "MongoDB is a popular NoSQL database that offers flexibility and scalability for modern applications. This article discusses essential best practices including schema design patterns, indexing strategies for optimal query performance, data modeling considerations, and when to use embedded documents versus references. We'll also cover connection pooling, write concerns, and read preferences for production deployments.",
    author: "Emily Davis"
  }
];

/**
 * Seed the database with sample posts
 */
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing posts (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing posts...');
    await Post.deleteMany({});
    console.log('✅ Existing posts cleared\n');

    // Insert sample posts
    console.log('📝 Inserting sample posts...');
    const createdPosts = await Post.insertMany(samplePosts);
    
    console.log(`✅ ${createdPosts.length} posts created successfully!\n`);
    
    // Display created posts
    console.log('📋 Created Posts:');
    console.log('='.repeat(60));
    createdPosts.forEach((post, index) => {
      console.log(`\n${index + 1}. ${post.title}`);
      console.log(`   Author: ${post.author}`);
      console.log(`   ID: ${post._id}`);
      console.log(`   Content Preview: ${post.content.substring(0, 80)}...`);
    });
    console.log('\n' + '='.repeat(60));
    console.log('\n🎉 Database seeding completed!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the seed function
seedDatabase();
