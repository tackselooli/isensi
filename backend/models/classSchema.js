const Joi = require('@hapi/joi');

const classSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().required(),
  price: Joi.number().required(),
  videoLink: Joi.string().uri().required(),
  description: Joi.string().required(),
  instructorName: Joi.string().valid('سنسی سجاد').default('سنسی سجاد'),
  instructorEmail: Joi.string().email().valid('isensi@gmail.com').default('isensi@gmail.com'),
  packageDuration: Joi.string().required(),
  status: Joi.string().valid('approved', 'pending', 'rejected').default('pending'),
  reason: Joi.string().allow(null),
  totalEnrolled: Joi.number().default(0),
  targetAudience: Joi.string().valid('Women', 'Men', 'Seniors', 'Beginners').required(),
  equipmentRequired: Joi.array().items(Joi.string()).required(),
  packageGoals: Joi.string().required(),
  packageFormat: Joi.string().valid('Video lessons', 'PDF guides', 'Live sessions').required(),
  nutritionalPlan: Joi.string().allow(null),
  accessDuration: Joi.string().valid('Lifetime', '6 months').required(),
  packageReviews: Joi.array().items(Joi.object({
    userId: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().allow(null)
  })),
  difficultyLevel: Joi.string().valid('Beginner', 'Intermediate', 'Advanced').required(),
  prerequisites: Joi.string().allow(null),

  // New fields for discount
  discountCode: Joi.string().allow(null),
  discountPercentage: Joi.number().min(0).max(100).default(0),
});

module.exports = classSchema;
