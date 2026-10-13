const express = require("express");
const cloudinary = require('cloudinary').v2;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const axios = require('axios');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const userSchema = require('./models/userSchema'); // Adjust the path as necessary
const classSchema = require('./models/classSchema');
const articleSchema = require('./models/articleSchema');
// NOTE: instructorSchema was previously imported from articleSchema by mistake
// and was never actually used anywhere. Removed to avoid confusion.
const corsConfig = require('./config/corsConfig');


const {verifyJWT, verifyAdmin, verifyInstructor } = require('./middlewares/authMiddleware');

require("dotenv").config();
const { MongoClient, MongoError } = require("mongodb");
const { ObjectId } = require("mongodb");

// Zarinpal payment constants (read from .env, with sane fallbacks)
const ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID || '00000000-0000-0000-0000-000000000000';
const ZARINPAL_API_URL = process.env.ZARINPAL_API_URL || 'https://api.zarinpal.com/pg/v4/payment/request.json';
const ZARINPAL_VERIFY_URL = process.env.ZARINPAL_VERIFY_URL || 'https://api.zarinpal.com/pg/v4/payment/verify.json';

const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
let client;

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware
app.use(corsConfig);

// NOTE: The global error handler must be registered AFTER all routes.
// It was previously placed here at the top, where it would never catch
// errors thrown by routes defined below. It has been moved to the bottom
// of the file, just before app.listen().



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})


// Function to connect to the database
async function connectToDatabase() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log("Connected successfully to local MongoDB!");

    // Create database and collections
    const database = client.db("sajad-app-db");
    global.userCollection = database.collection("users");
    global.classesCollection = database.collection("classes");
    global.cartCollection = database.collection("cart");
    global.paymentCollection = database.collection("payment");
    global.enrolledCollection = database.collection("enroll");
    global.appliedCollection = database.collection("applied");
    global.articleCollection = database.collection("articles"); // Add article collection


    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if the connection fails
  }
}



// Function to define routes and start the server
async function run() {
  // Ensure that the database is connected before setting up routes
  await connectToDatabase();


  // Routes
  // user routes
// Example protected route
app.get('/protected-route', verifyJWT, (req, res) => {
  res.send({ message: "This is a protected route", user: req.decoded });
});
  // new user

  app.post("/new-user", async (req, res) => {
    // Validate user data (without checking for role)
    const { error, value } = userSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: "Validation Error",
            errors: error.details
        });
    }

    try {
        // Extract and sanitize user data
        const { password, ...userData } = value;

        // Always set the role to 'user' regardless of what's in the request body
        const newUser = {
            ...userData,
            email: value.email.toLowerCase(), // Basic sanitization: lowercase email
            password: await bcrypt.hash(password, 10), // Hash the password
            role: 'user', // Force role to be 'user'
        };

        // Insert user into the database
        const result = await userCollection.insertOne(newUser);

        // Send response with sanitized data (optional)
        const sanitizedUser = {
            _id: result.insertedId,
            name: newUser.name,
            email: newUser.email,
            // ... other fields you want to expose
        };

        res.status(201).json({ message: "User created successfully", data: sanitizedUser });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});




  // api version
  // JWT Token Route
app.post("/api/set-token", (req, res) => {
  const user = req.body;
  
  // Validate user data if needed
  if (!user || !user.email) {
    return res.status(400).send({ message: "Invalid user data" });
  }

  try {
    const token = jwt.sign(user, process.env.ACCESS_SECRET, { expiresIn: "24h" });
    res.send({ token });
  } catch (error) {
    console.error("Error creating JWT:", error);
    res.status(500).send({ message: "Error generating token" });
  }
});

// Add this route to your existing routes in server.js
app.get('/api/verify-token', (req, res) => {
  // Accept token from either the HTTP-only cookie OR the Authorization header.
  // The frontend uses `Authorization: Bearer <token>` in addition to cookies.
  const token =
    req.cookies.token ||
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    res.status(200).json({ user: decoded });
  } catch (err) {
    console.error('Token verification error:', err); // Log verification error
    res.status(401).json({ message: 'Invalid token' });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  try {
    const database = client.db('sajad-app-db');
    const userCollection = database.collection('users');
    const user = await userCollection.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.ACCESS_SECRET,
      { expiresIn: '24h' }
    );

    console.log(token)

    // Set token as an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'Lax', // Or 'Strict' depending on your needs
      secure: process.env.NODE_ENV === 'production', // false for local, true for production
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Return user data and token
    res.status(200).json({
      message: "Login successful",
      user: { userId: user._id, email: user.email, role: user.role },
      token
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: "Logged out successfully" });
});

// Get All Users
// Get Paginated Users
// Get Paginated Users
app.get("/users", verifyJWT, async (req, res) => {
  if (!userCollection) {
    return res.status(500).send({ message: "Database not initialized" });
  }

  try {
    // Validate and sanitize pagination query parameters
    const page = Math.max(parseInt(req.query.page) || 1, 1); // Default to page 1 if not provided
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 9, 1), 100); // Default to limit 10, minimum 1, max 100

    // Calculate the skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch paginated users from the collection
    const users = await userCollection
      .find({})
      .skip(skip)   // Skip to the correct page
      .limit(limit) // Limit the number of results
      .toArray();

    // Count total users for pagination metadata
    const totalUsers = await userCollection.countDocuments();

    // Sanitize the user data
    const sanitizedUsers = users.map(user => ({
      _id: user._id,
      photo: user.photourl,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }));

    // Send paginated users and metadata
    res.send({
      totalUsers,                // Total number of users in the collection
      totalPages: Math.ceil(totalUsers / limit), // Calculate the total number of pages
      currentPage: page,         // Current page number
      pageSize: limit,           // Number of users per page
      users: sanitizedUsers      // Sanitized user data
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});




// Get User by ID
app.get("/users/:id", verifyJWT, async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const userId = new ObjectId(id);
    const user = await userCollection.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sanitizedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,  // Add more fields if needed
      address: user.address,
      gender: user.gender,
      photourl: user.photourl
    };

    res.send(sanitizedUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});





  // delete user
  app.delete("/delete-user/:id", verifyJWT, verifyAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      const userId = new ObjectId(id); // Might throw an error for invalid IDs

      // Check if user exists before deletion
      const userToDelete = await userCollection.findOne({ _id: userId });
      if (!userToDelete) {
        return res.status(404).json({ message: "User not found" });
      }

      // Perform deletion
      const result = await userCollection.deleteOne({ _id: userId });
      const deletedCount = result.deletedCount;

      if (deletedCount === 0) {
        // Handle potential errors (e.g., race conditions)
        return res.status(500).json({ message: "Failed to delete user" });
      }

      res.status(204).send(); // No content response for successful deletion
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // update user info
  app.put("/update-user/:id", verifyJWT, verifyAdmin, async (req, res) => {
    const id = req.params.id;
    const updatedUser = req.body;

    // Define Joi schema for input validation
    const userSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      role: Joi.string(),
      address: Joi.string(),
      phone: Joi.string()
        .pattern(/^(09)\d{9}$/)
        .required(), // Example phone number validation
      about: Joi.string().max(500), // Limit about field to 500 characters
      photoUrl: Joi.string().uri(), // Assuming photoUrl is a valid URL
      skills: Joi.array().items(Joi.string()),
    });

    // Validate user input
    const { error } = userSchema.validate(updatedUser);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    try {
      // Create a sanitized user object (adjust sanitization as needed)
      const sanitizedUser = {
        name: updatedUser.name.trim(),
        email: updatedUser.email.toLowerCase().trim(),
        role: updatedUser.role,
        address: updatedUser.address,
        phone: updatedUser.phone,
        about: updatedUser.about?.substring(0, 500), // Truncate about if too long
        photoUrl: updatedUser.photoUrl,
        skills: updatedUser.skills,
      };

      // Update the user via the native MongoDB collection.
      // (The previous code referenced a Mongoose `User` model that is not
      // loaded anywhere in this project — it would throw ReferenceError.)
      const filter = { _id: new ObjectId(id) };
      const updateResult = await userCollection.findOneAndUpdate(
        filter,
        { $set: sanitizedUser },
        { returnDocument: 'after' }
      );
      const user = updateResult.value || updateResult;

      if (!user) {
        return res.status(404).send("User not found");
      }

      res.send(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred during user update");
    }
  });

  // Handle new class creation
  app.post("/new-class", verifyJWT, async (req, res) => {
    try {
      const { error } = classSchema.validate(req.body);
      if (error) return res.status(400).send({ message: error.details[0].message });
  
      const newClass = {
        ...req.body,
        instructorName: 'سنسی سجاد',
        instructorEmail: 'isensi@gmail.com',
        prerequisites: req.body.prerequisites || null, // Explicitly set prerequisites to null if not provided
        totalEnrolled: req.body.totalEnrolled || 0,   // Set default for totalEnrolled if not provided
      };
  
      const result = await classesCollection.insertOne(newClass);
      res.status(201).send(result);
    } catch (error) {
      console.error("Error inserting class:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });

  // Get all classes (status = "approved")
  app.get("/classes", async (req, res) => {
    try {
      // Connection is already established at startup (run() calls connectToDatabase).
      // Do NOT call connectToDatabase() again here — it would create a second
      // MongoClient and leak the previous one.
      const query = { status: "approved" };
      const classes = await classesCollection.find(query).toArray();
      res.status(200).json(classes);
    } catch (error) {
      // Handle connection errors and other potential errors
      console.error("Error fetching classes:", error);
      if (error instanceof MongoError) {
        res.status(500).send({ message: "MongoDB error: " + error.message });
      } else {
        res.status(500).send({ message: "Internal Server Error" });
      }
    }
  });

  // filter class with instructor email
  app.get("/classes/:email", verifyJWT, verifyInstructor, async (req, res) => {
    try {
      const instructorEmail = req.params.email;
      const classes = await classesCollection
        .find({ instructorEmail })
        .toArray();
      if (classes.length > 0) {
        res.status(200).json(classes);
      } else {
        res
          .status(404)
          .send({ message: "No classes found for this instructor" });
      }
    } catch (error) {
      console.error("Error fetching classes by instructor email:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });

  // get all class, no matter status
  app.get("/class-manage", async (req, res) => {
    try {
      const classes = await classesCollection.find().toArray();
      res.status(200).json(classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });

  // update status of class. [approved, pending, rejected( you can write reason for it)]
  app.patch("/change-status/:id", verifyJWT, verifyAdmin, async (req, res) => {
    const classId = req.params.id;
    const { status, reason } = req.body;

    // Validate the provided class ID
    if (!ObjectId.isValid(classId)) {
      return res.status(400).send({ message: "Invalid class ID" });
    }

    // Validate the status field
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).send({ message: "Invalid status value" });
    }

    // Prepare the update document
    const updateDoc = { $set: { status } };
    if (status === "rejected") {
      if (reason) {
        updateDoc.$set.reason = reason;
      } else {
        return res
          .status(400)
          .send({ message: "Reason is required when rejecting" });
      }
    } else {
      // Remove the reason field if the status is not rejected
      updateDoc.$unset = { reason: "" };
    }

    try {
      // Define filter for update
      const filter = { _id: new ObjectId(classId) };

      // Fetch the existing document
      const existingClass = await classesCollection.findOne(filter);
      if (!existingClass) {
        return res.status(404).send({ message: "Class not found" });
      }

      // Check if the current status is already the desired status
      if (existingClass.status === status) {
        return res.status(200).send({
          message: "Class status is already set to the requested value",
          updatedClass: existingClass,
        });
      }

      // Perform the update
      const result = await classesCollection.updateOne(filter, updateDoc);

      if (result.modifiedCount === 1) {
        // Fetch the updated document to show the changes
        const updatedClass = await classesCollection.findOne(filter);
        res.status(200).send({
          message: "Class status updated successfully",
          updatedClass,
        });
      } else {
        res.status(404).send({ message: "Class not found" });
      }
    } catch (error) {
      console.error("Error updating class status:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });

  // get approved classes
  app.get("/approved-classes", async (req, res) => {
    try {
      const approvedClasses = await classesCollection
        .find({ status: "approved" })
        .toArray();
      res.send(approvedClasses);
    } catch (error) {
      console.error("Error fetching approved classes:", error);
      res.status(500).send("Internal Server Error");
    }
  });


  // Article Routes

// Create a new article
// Route for creating a new article
app.post("/new-article", async (req, res) => {
  // Validate the incoming article data using Joi
  const { error, value } = articleSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Validation Error",
      errors: error.details // Send validation errors back to the client
    });
  }

  try {
    // Extract article data from validated value
    const { title, content, authorName, authorEmail, publicationDate, imageUrl, category, tags, isPublished } = value;

    // Ensure at least one tag is provided or set a default
    const articleTags = tags && tags.length > 0 ? tags : ["Default Tag"];

    // Create new article object
    const newArticle = {
      title,
      content,
      authorName,
      authorEmail,
      publicationDate,
      imageUrl,
      category,
      tags: articleTags,
      isPublished,
      views: 0,
      comments: [],
      likes: 0,
      shares: 0,
      relatedArticles: [] // Set as empty if not provided
    };

    // Insert the new article into the collection
    const result = await articleCollection.insertOne(newArticle);

    // Send success response
    res.status(201).json({
      message: "Article created successfully",
      data: newArticle
    });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Get all articles
app.get('/articles', async (req, res) => {
  try {
    // Validate and sanitize pagination query parameters
    const page = Math.max(parseInt(req.query.page) || 1, 1); // Default to page 1 if not provided
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 9, 1), 100); // Default to limit 9, minimum 1, max 100

    // Calculate the skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch paginated articles from the collection
    const articles = await articleCollection
      .find({})
      .skip(skip)   // Skip to the correct page
      .limit(limit) // Limit the number of results
      .toArray();

    // Count total articles for pagination metadata
    const totalArticles = await articleCollection.countDocuments();

    // Send paginated articles and metadata
    res.send({
      totalArticles,                // Total number of articles in the collection
      totalPages: Math.ceil(totalArticles / limit), // Calculate the total number of pages
      currentPage: page,         // Current page number
      pageSize: limit,           // Number of articles per page
      articles                   // Articles data
    });
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Get a specific article by ID
app.get('/articles/:id', async (req, res) => {
  try {
    const articleId = new ObjectId(req.params.id);
    const article = await articleCollection.findOne({ _id: articleId });
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(article);
  } catch (err) {
    console.error("Error fetching article:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a specific article by ID
app.put('/articles/:id', async (req, res) => {
  const { error, value } = articleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Validation Error", errors: error.details });
  }

  try {
    const articleId = new ObjectId(req.params.id);
    const updatedArticle = await articleCollection.findOneAndUpdate(
      { _id: articleId },
      { $set: value },
      { returnDocument: 'after' }
    );
    const updated = updatedArticle.value || updatedArticle;
    if (!updated) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({ message: "Article updated successfully", data: updated });
  } catch (err) {
    console.error("Error updating article:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a specific article by ID
app.delete('/articles/:id', async (req, res) => {
  try {
    const articleId = new ObjectId(req.params.id);
    const result = await articleCollection.deleteOne({ _id: articleId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting article:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


  // get instructors
  app.get("/instructors", async (req, res) => {
    try {
      const instructors = await userCollection
        .find({ role: "instructor" })
        .toArray();
      res.send(instructors);
    } catch (error) {
      console.error("Error  fetching instructors:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.get("/class/:id", async (req, res) => {
    const classId = req.params.id;

    // Validate the provided class ID
    if (!ObjectId.isValid(classId)) {
      return res.status(400).send({ message: "Invalid class ID" });
    }

    try {
      // Define filter for finding the class
      const filter = { _id: new ObjectId(classId) };

      // Fetch the class document from the collection
      const classDocument = await classesCollection.findOne(filter);

      if (classDocument) {
        res.status(200).send(classDocument);
      } else {
        res.status(404).send({ message: "Class not found" });
      }
    } catch (error) {
      console.error("Error fetching class:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });

  app.put(
    "/update-class/:id",
    verifyJWT,
    verifyInstructor,
    async (req, res) => {
      const classId = req.params.id;
      const updatedDetails = req.body;

      // Validate the provided class ID
      if (!ObjectId.isValid(classId)) {
        return res.status(400).send({ message: "Invalid class ID" });
      }

      // Ensure that the updated details are provided and valid
      if (!updatedDetails || Object.keys(updatedDetails).length === 0) {
        return res.status(400).send({ message: "No update details provided" });
      }

      // Prepare the update document
      const updateDoc = { $set: updatedDetails };

      try {
        // Define filter for finding the class
        const filter = { _id: new ObjectId(classId) };

        // Fetch the existing document to compare before updating
        const existingClass = await classesCollection.findOne(filter);
        if (!existingClass) {
          return res.status(404).send({ message: "Class not found" });
        }

        // Perform the update
        const result = await classesCollection.updateOne(filter, updateDoc);

        if (result.matchedCount === 1) {
          if (result.modifiedCount === 1) {
            // Fetch the updated document to show the changes
            const updatedClass = await classesCollection.findOne(filter);
            res.status(200).send({
              message: "Class details updated successfully",
              updatedClass,
            });
          } else {
            // No fields were updated, return existing class details
            res.status(200).send({
              message: "Class details are already up-to-date",
              updatedClass: existingClass,
            });
          }
        } else {
          res.status(404).send({ message: "Class not found" });
        }
      } catch (error) {
        console.error("Error updating class details:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    }
  );

  // discount 
  app.post("/apply-discount", async (req, res) => {
    try {
      const { classId, discountCode } = req.body;
  
      // Find the class by ID
      const selectedClass = await classesCollection.findOne({ _id: new ObjectId(classId) });
  
      if (!selectedClass) {
        return res.status(404).send({ message: "Class not found" });
      }
  
      if (selectedClass.isFree) {
        return res.status(200).send({ discountedPrice: 0, message: "This class is free." });
      }
  
      // Check if discount code matches
      if (selectedClass.discountCode === discountCode) {
        const discountAmount = (selectedClass.price * selectedClass.discountPercentage) / 100;
        const discountedPrice = selectedClass.price - discountAmount;
        return res.status(200).send({ discountedPrice, message: "Discount applied successfully." });
      } else {
        return res.status(400).send({ message: "Invalid discount code." });
      }
    } catch (error) {
      console.error("Error applying discount:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });
  
  

  // cart routes

  // Add to Cart
  app.post("/add-to-cart", verifyJWT, async (req, res) => {

    const { userId, classId, email, name } = req.body;

    if (!userId || !name || !classId || !email) {
        return res.status(400).send({ message: "Missing required fields" });
    }
    // Validate input data
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(classId) || !email) {
        return res.status(400).send({ message: "Invalid user ID, class ID, or email" });
    }

    try {
      // Define filter and update document
      const filter = {
        userId: new ObjectId(userId),
        classId: new ObjectId(classId),
      };
      const updateDoc = {
        $set: {
          userId: new ObjectId(userId),
          classId: new ObjectId(classId),
          email: email, // Store the email address
          name: req.body.name
        },
      };
      const options = { upsert: true }; // Create a new cart item if it doesn't exist

      // Update or insert the cart item
      const result = await cartCollection.updateOne(filter, updateDoc, options);

      // Check the result and send appropriate response
      if (result.matchedCount === 1 || result.upsertedCount === 1) {
        res
          .status(200)
          .send({
            message: "Item added to cart successfully",
            cartItemId: result.upsertedId || filter._id,
          });
      } else {
        res.status(500).send({ message: "Failed to add item to cart" });
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });

  app.get("/cart-item/:id", verifyJWT, async (req, res) => {
    const cartId = req.params.id;

    // Validate cart ID
    if (!ObjectId.isValid(cartId)) {
      console.log(`Invalid cart ID format: ${cartId}`);
      return res.status(400).json({ message: "Invalid cart ID format" });
    }

    try {
      // Find the cart item by ID
      const cartItem = await cartCollection.findOne(
        { _id: new ObjectId(cartId) },
        { projection: { userId: 1, classId: 1, email: 1 } }
      );

      // If no cart item is found
      if (!cartItem) {
        console.log(`Cart item with ID ${cartId} not found in the database.`);
        return res.status(404).json({ message: "Cart item not found" });
      }

      // Return the cart item details
      res.status(200).json({
        cartItem: {
          _id: cartItem._id,
          userId: cartItem.userId,
          userEmail: cartItem.email, // Using email directly from the cart collection
          classId: cartItem.classId,
          // Include any other cart item details if necessary
        },
      });
    } catch (error) {
      console.error("Error fetching cart item:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get("/cart-by-email/:email", verifyJWT, async (req, res) => {
    const email = req.params.email;

    try {
        // Log the received email parameter
        console.log(`Received email parameter: ${email}`);

        // Query to find cart items by user email
        const query = { email: email };
        const projection = { classId: 1 };

        // Find all cart items for the given email
        const carts = await cartCollection.find(query, { projection }).toArray();
        
        // Check if any cart items were found
        if (carts.length === 0) {
            return res
                .status(404)
                .json({ message: "No cart items found for the provided email" });
        }

        // Extract classIds from the cart items and convert them to ObjectId
        const classIds = carts.map((cart) => new ObjectId(cart.classId));

        // Query to find all classes corresponding to the classIds
        const classesQuery = { _id: { $in: classIds } };
        const classes = await classesCollection.find(classesQuery).toArray();

       
        // Check if any classes were found
        if (classes.length === 0) {
            return res
                .status(404)
                .json({
                    message: "No matching classes found for the provided class IDs",
                });
        }

        // Respond with the found classes
        res.status(200).json(classes);
    } catch (error) {
        console.error("Error fetching cart items and classes:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});




app.delete("/delete-cart-item/:classId", verifyJWT, async (req, res) => {
  const classId = req.params.classId;

  // Validate classId (assuming it's a valid ObjectId format)
  if (!ObjectId.isValid(classId)) {
    return res.status(400).json({ message: "Invalid classId format" });
  }

  try {
    // Create a filter for the cart item to be deleted by classId
    const query = { classId: new ObjectId(classId) };

    // Perform the deletion
    const result = await cartCollection.deleteOne(query);

    // Check if the item was deleted
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Cart item deleted successfully" });
    } else {
      res.status(404).json({ message: "Cart item not found" });
    }
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



  // payment routes
  app.post("/create-payment-request", verifyJWT, async (req, res) => {
    const { amount, callbackUrl } = req.body;

    try {
      const response = await axios.post(ZARINPAL_API_URL, {
        merchant_id: ZARINPAL_MERCHANT_ID,
        amount: amount * 10, // Convert to Toman
        description: "Payment for course",
        callback_url: callbackUrl,
      });

      if (response.data.data.code === 100) {
        res.json({
          paymentUrl: `https://www.zarinpal.com/pg/StartPay/${response.data.data.authority}`,
        });
      } else {
        res.status(400).json({ message: `Error: ${response.data.errors}` });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  });

  app.get("/verify-payment", verifyJWT, async (req, res) => {
    const { Authority, Status } = req.query;

    if (Status === "OK") {
      try {
        const response = await axios.post(ZARINPAL_VERIFY_URL, {
          merchant_id: ZARINPAL_MERCHANT_ID,
          amount: req.query.amount * 10, // Amount should match the one sent during the request
          authority: Authority,
        });

        if (response.data.data.code === 100) {
          res.json({
            message: "Payment successful",
            refId: response.data.data.ref_id,
          });
        } else {
          res
            .status(400)
            .json({ message: `Payment failed: ${response.data.errors}` });
        }
      } catch (error) {
        res
          .status(500)
          .json({ message: "Internal Server Error", error: error.message });
      }
    } else {
      res.status(400).json({ message: "Payment was not successful" });
    }
  });

  app.get("/payment-history/:email", async (req, res) => {
    const email = req.params.email;
    const query = { userEmail: email };
    const result = await paymentCollection
      .find(query)
      .sort({ date: -1 })
      .toArray();
    res.send(result);
  });

  app.get("/payment-history-length/:email", async (req, res) => {
    const email = req.params.email;
    const query = { userEmail: email };
    const total = await paymentCollection.countDocuments(query);
    res.send({ total });
  });

  // Enrollment routes
  app.get("/popular_classes", async (req, res) => {
    const result = await classesCollection
      .find()
      .sort({ totalEnrolled: -1 })
      .limit(6)
      .toArray();
    res.send(result);
  });

  app.get("/popular-instructors", async (req, res) => {
    try {
      const pipeline = [
        {
          $match: {
            role: "instructor"
          }
        },
        {
          $lookup: {
            from: "classesCollection",
            localField: "email",
            foreignField: "instructorEmail",
            as: "classes"
          }
        },
        {
          $unwind: {
            path: "$classes",
            preserveNullAndEmptyArrays: true // Preserve instructors even if they have no classes
          }
        },
        {
          $group: {
            _id: "$_id", // Group by instructor ID
            name: { $first: "$name" },
            email: { $first: "$email" },
            photoUrl: { $first: "$photoUrl" },
            gender: { $first: "$gender" },
            address: { $first: "$address" },
            phone: { $first: "$phone" },
            totalEnrolled: { $sum: { $ifNull: ["$classes.totalEnrolled", 0] } } // Sum up totalEnrolled
          }
        },
        {
          $project: {
            _id: 0,
            instructor: {
              _id: "$_id",
              name: "$name",
              email: "$email",
              photoUrl: "$photoUrl",
              gender: "$gender",
              address: "$address",
              phone: "$phone"
            },
            totalEnrolled: 1
          }
        },
        {
          $sort: {
            totalEnrolled: -1
          }
        },
        {
          $limit: 6
        }
      ];
  
      const result = await userCollection.aggregate(pipeline).toArray();
      res.send(result);
    } catch (error) {
      console.error("Error fetching popular instructors:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Admin
  app.get("/admin-stats", verifyJWT, verifyAdmin, async (req, res) => {
    // Get approved classes and pending classes and instructors
    const approvedClasses = (
      await classesCollection.find({ status: "approved" }).toArray()
    ).length;
    const pendingClasses = (
      await classesCollection.find({ status: "pending" }).toArray()
    ).length;
    const instructors = (
      await userCollection.find({ role: "instructor" }).toArray()
    ).length;
    const totalClasses = (await classesCollection.find().toArray()).length;
    const totalEnrolled = (await enrolledCollection.find().toArray()).length;
    // const totalRevenue = await paymentCollection.find().toArray();
    // const totalRevenueAmount = totalRevenue.reduce((total, current) => total + parseInt(current.price), 0);
    const result = {
      approvedClasses,
      pendingClasses,
      instructors,
      totalClasses,
      totalEnrolled,
      // totalRevenueAmount
    };
    res.send(result);
  });

  // Note: /instructors is already defined above (around line 700).
  // Do NOT redefine it here — the second registration would silently override
  // the first one and any future changes to the original would be lost.

  app.get("/enrolled-classes/:email", verifyJWT, async (req, res) => {
    const email = req.params.email;
    const query = { userEmail: email };
    const pipeline = [
      {
        $match: query,
      },
      {
        $lookup: {
          from: "classes",
          localField: "classesId",
          foreignField: "_id",
          as: "classes",
        },
      },
      {
        $unwind: "$classes",
      },
      {
        $lookup: {
          from: "users",
          localField: "classes.instructorEmail",
          foreignField: "email",
          as: "instructor",
        },
      },
      {
        $project: {
          _id: 0,
          classes: 1,
          instructor: {
            $arrayElemAt: ["$instructor", 0],
          },
        },
      },
    ];
    const result = await enrolledCollection.aggregate(pipeline).toArray();
    // const result = await enrolledCollection.find(query).toArray();
    res.send(result);
  });

  // applied routes

  // Applied route
  app.post("/as-instructor", async (req, res) => {
    try {
      const data = req.body;
      const result = await appliedCollection.insertOne(data);
      res.send(result);
    } catch (error) {
      console.error("Error creating applied instructor record:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });

  app.get("/applied-instructors/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const result = await appliedCollection.findOne({ email });
      res.send(result);
    } catch (error) {
      console.error("Error fetching applied instructor:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  // ---------------------------------------------------------------------
  // Global error handler. MUST be registered AFTER all routes to catch
  // errors passed via next(err) or thrown asynchronously in routes.
  // ---------------------------------------------------------------------
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    if (res.headersSent) return next(err);
    res.status(err.status || 500).send({ error: err.message || 'Internal server error' });
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  // Properly close the MongoDB connection when the application is terminated
  process.on("SIGINT", async () => {
    console.log("Closing MongoDB connection...");
    await client.close();
    process.exit(0);
  });
}

// Call the run function to initiate the server and database connection
run();
