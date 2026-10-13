const bcrypt = require('bcrypt');
const { User } = require('../models/userSchema');

exports.createUser = async (req, res) => {
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: "Validation Error", errors: error.details });
  }

  try {
    const { password, ...userData } = value;
    const newUser = {
      ...userData,
      email: value.email.toLowerCase(),
      password: await bcrypt.hash(password, 10),
      role: 'user',
    };

    const result = await User.create(newUser);
    const sanitizedUser = {
      _id: result._id,
      name: newUser.name,
      email: newUser.email,
    };

    res.status(201).json({ message: "User created successfully", data: sanitizedUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Similar structure for getAllUsers, getUserById, updateUser, and deleteUser
