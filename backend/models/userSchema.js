// models/userSchema.js

const Joi = require('@hapi/joi');

const userSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().pattern(/^(09)\d{9}$/).required(), // Ensures phone number follows the correct pattern
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    photourl: Joi.string().allow(""), // Allows an empty photo URL
    role: Joi.string().valid('admin', 'instructor', 'user').default('user'), // Defines user roles and sets a default
    gender: Joi.string().valid('Male', 'Female', 'Other').allow(""), // Allows empty gender and predefined values
    address: Joi.string().allow("") // Allows an empty address
});

module.exports = userSchema;
