const Joi = require('@hapi/joi');

const articleSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().min(100).required(), // Ensure the content has a minimum length
  authorName: Joi.string().required(),
  authorEmail: Joi.string().email().required(),
  publicationDate: Joi.date().iso().required(), // ISO 8601 format
  htmlContent: String, // This field will hold the article's HTML content
  imageUrl: Joi.string().uri().allow(null), // URL for the article image
  category: Joi.string().valid('Fitness', 'Nutrition', 'Wellness', 'Other').required(),
  tags: Joi.array().items(Joi.string()).max(5), // Up to 5 tags
  isPublished: Joi.boolean().default(false), // Whether the article is published
  views: Joi.number().integer().default(0), // Number of views
  comments: Joi.array().items(Joi.object({
    userId: Joi.string().required(),
    comment: Joi.string().min(1).required(),
    date: Joi.date().iso().required()
  })).default([]),
  likes: Joi.number().integer().default(0), // Number of likes
  shares: Joi.number().integer().default(0), // Number of shares
  relatedArticles: Joi.array().items(Joi.string().uri()).allow(null), // Related articles URLs
});

module.exports = articleSchema;
