const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT
const generateToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, {
        expiresIn: "3d",
    });
};

const signupUser = async (req, res) => {
    const {
        username,
        password,
        phoneNumber,
        name,
        role
    } = req.body;
    try {
        if (
            !name ||
            !username ||
            !password ||
            !phoneNumber
        ) {
            res.status(400);
            throw new Error("Please add all fields");
        }
        // Check if user exists
        const userExists = await User.findOne({ username });

        if (userExists) {
            res.status(400);
            throw new Error("User already exists");
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            username,
            password: hashedPassword,
            phoneNumber,
            name,
            role: role || "user"
        });

        if (user) {
            const token = generateToken(user._id);
            console.log(token)
            res.status(201).json({ username: user.username, token, name: user.name, phoneNumber: user.phoneNumber, role: user.role });
        } else {
            res.status(400);
            throw new Error("Invalid user data");
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            res.status(400);
            throw new Error("Please add all fields")
        }
        // Check for user email
        const user = await User.findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user._id);
            res.status(200).json({
                username: user.username,
                name: user.name,
                phoneNumber: user.phoneNumber,
                role: user.role,
                token
            });
        } else {
            res.status(400);
            throw new Error("Invalid credentials");
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    signupUser,
    loginUser,
};