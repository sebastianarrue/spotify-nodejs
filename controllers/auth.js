const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Configure Nodemailer to use SendGrid
const transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
        user: 'apikey', // This must literally be the string 'apikey'
        pass: process.env.SENDGRID_API_KEY
    }
});

exports.signup = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // 1. Check if user already exists
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // 2. Hash the password (salt rounds = 12 for good security)
        const hashedPassword = await bcrypt.hash(password, 12);

        // 3. Create the user in MySQL (First user can be set to admin manually later)
        const newUser = await User.create({
            email: email,
            password: hashedPassword,
            isAdmin: false
        });

        // 4. Send Welcome Email asynchronously
        transporter.sendMail({
            to: email,
            from: 'sebasdap_97@outlook.com', // Replace with your verified sender email
            subject: 'Welcome to Spotify Clone!',
            html: `<h1>Welcome aboard!</h1><p>We are thrilled to have you, ${email}. Get ready to create some awesome playlists.</p>`
        }).catch(err => console.log('Email sending failed:', err));

        res.status(201).json({ message: 'User created successfully!', userId: newUser.id });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // 1. Find the user
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // 2. Compare the provided password with the hashed password
        const doMatch = await bcrypt.compare(password, user.password);
        if (!doMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // 3. Set the session variables
        req.session.isLoggedIn = true;
        req.session.user = {
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin
        };

        // Ensure session is saved before sending the response
        req.session.save((err) => {
            if (err) console.log(err);
            res.status(200).json({ message: 'Logged in successfully!', user: req.session.user });
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
        res.status(200).json({ message: 'Logged out successfully.' });
    });
};