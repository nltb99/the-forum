const express = require('express'),
    route = express.Router(),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    nodemailer = require('nodemailer'),
    { resetVerifyToken } = require('./globalServer/authFunc');
// client = require('./globalServer/redisClient');

const UserQandASchema = require('../model/user');

route.get('/users', async (req, res) => {
    const users = await UserQandASchema.find({});
    await res.json(users);
});

route.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ msg: 'Please Enter All Field' });
    }
    UserQandASchema.findOne({ username }).then(async (user) => {
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const newUser = await new UserQandASchema({ username, password });
        await newUser.save().then((user) => {
            jwt.sign(
                { _id: user._id },
                process.env.SECRET_JWT,
                { expiresIn: 60 * 60 },
                (err, token) => {
                    if (err) throw err;
                    const obj = {
                        token: token,
                        username: user.username,
                    };
                    res.json(obj);
                },
            );
        });
    });
});

route.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ msg: 'Please Enter All Field' });
    }
    UserQandASchema.findOne({ username }).then((user) => {
        if (!user) {
            return res.status(204).json({ msg: 'User not exists' });
        }
        bcrypt.compare(password, user.password, (err, results) => {
            if (err) throw err;
            if (!results) {
                return res.status(206).json({ msg: 'Password does not match' });
            } else if (results) {
                jwt.sign(
                    { _id: user._id, username: username },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: 60 * 60 * 24 * 3 },
                    (err, token) => {
                        if (err) throw err;
                        const obj = {
                            token: token,
                            username: user.username,
                        };
                        return res.status(200).json(obj);
                    },
                );
            }
        });
    });
});

route.patch('/update', resetVerifyToken, async (req, res) => {
    try {
        await UserQandASchema.findOne({ username: req.idResetToken }).then((user) => {
            if (user === null) return res.status(404).json({ msg: 'Not Found' });
            if (user.username !== req.idResetToken)
                return res.status(403).json({ msg: 'Not Allow' });
            if (req.body.password !== null) user.password = req.body.password;
            user.save();
            res.status(200).json({ msg: 'Update succeed!' });
        });
    } catch (e) {
        console.log(e);
    }
});

route.post('/logout', async (req, res) => {
    console.log('asd');
});

route.delete('/:id', async (req, res) => {
    try {
        const user = await UserQandASchema.findById({ _id: req.params.id });
        await user.delete();
        return res.status(200).json({ msg: 'Delete succeed!' });
    } catch {
        return res.status(403).json({ msg: 'Cannot delete!' });
    }
});

route.post('/temp', generateResetToken, async (req, res) => {
    try {
        return res.status(200).json({ token: req.resetToken });
    } catch (err) {
        console.log(err);
    }
});

route.post('/resetpassword', generateResetToken, async (req, res) => {
    try {
        let transporter = await nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.USERGMAIL,
                pass: process.env.PASSWORDGMAIL,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        let outputMail = `
                <h1>Link To Refresh</h1>
                <h1>http://localhost:3000/user/resetpassword?tk=${req.resetToken}</h1>
                `;

        await transporter.sendMail(
            {
                from: '"Bao Store" <collardoor.ver@gmail.com>',
                to: req.body.email,
                subject: 'Reset Password Link',
                text: 'CCCC',
                html: outputMail,
            },
            (err, data) => {
                if (err) console.log('Error');
                else {
                    console.log('Email sent!!');
                    return res.status(200).json({ msg: 'Email sent' });
                }
            },
        );
    } catch (err) {
        console.log(err);
    }
});

function generateResetToken(req, res, next) {
    jwt.sign(
        { username: req.body.username },
        process.env.RESET_TOKEN_SECRET,
        { expiresIn: 60 * 10 },
        (err, token) => {
            if (err) throw err;
            req.resetToken = token;
            next();
        },
    );
}

module.exports = route;
