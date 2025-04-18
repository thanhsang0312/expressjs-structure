const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret";

const findUserByUsername = async (username) => {
    return await User.findOne({ username });
};

const validatePassword = (plainPassword, hashedPassword) => {
    return bcrypt.compareSync(plainPassword, hashedPassword);
};

const generateToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username, role: user.role }, SECRET_KEY, {
        expiresIn: "1h",
    });
};

const verifyToken = (token, callback) => {
    jwt.verify(token, SECRET_KEY, callback);
};

const createUser = async (username, password, email) => {
    // Check if username already exists
    const existingUser = await User.findOne({ 
        $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
        throw new Error('Username or email already exists');
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({
        username,
        password: hashedPassword,
        email
    });

    await newUser.save();
    return newUser;
};

const checkUserExists = async (username) => {
    const user = await findUserByUsername(username);
    return !!user;
};

module.exports = {
    findUserByUsername,
    validatePassword,
    generateToken,
    verifyToken,
    createUser,
    checkUserExists,
};
