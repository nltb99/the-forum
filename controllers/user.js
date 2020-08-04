const express = require('express'),
    route = express.Router(),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    nodemailer = require('nodemailer'),
    { resetVerifyToken } = require('./globalServer/authFunc');
// client = require('./globalServer/redisClient');

const UserQandASchema = require('../model/user');

route.get('/users', async (req, res) => {
    try {
        const users = await UserQandASchema.find({});
        return res.status(200).json(users);
    } catch (e) {
        return res.status(400).json({ msg: 'Error' });
    }
});

route.post('/register', async (req, res) => {
    try {
        const { username, password, email } = await req.body;
        if (!username || !password) {
            return res.status(400).json({ msg: 'Input must not be null' });
        }
        await UserQandASchema.find({}).then(async (users) => {
            if (users.some((e) => e.username === username))
                return res.status(400).json({ msg: 'User already exists' });
            if (users.some((e) => e.email === email))
                return res.status(400).json({ msg: 'Email already exists' });
            const newUser = await new UserQandASchema({ username, password, email });
            await newUser.save();
            return res.status(200).json({ msg: 'Register succeed!' });
        });
    } catch (e) {
        return res.status(400).json({ msg: 'Register error' });
    }
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
                return res.status(206).json({ msg: 'Incorrect password' });
            } else if (results) {
                jwt.sign(
                    { _id: user._id, username: username },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: 60 * 60 * 24 * 3 },
                    (err, token) => {
                        if (err) throw err;
                        const obj = {
                            token: token,
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

route.delete('/', async (req, res) => {
    try {
        const user = await UserQandASchema.findById({ _id: req.body.id });
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
                <div style="font-family: Arial, Courier, serif;" >
                    <h2 style="color: lightseagreen;">Wondering Site</h2>
                    <div >
                        <h4>Hello ${req.body.username}</h4>
                        <h4>We received a request to reset the password for: ${req.body.email}</h4>
                        <h4>Simple click on the button to set a new password</h4>
                        <a href="http://localhost:3000/user/resetpassword?tk=${req.resetToken}"
                            style="text-decoration:none;padding:10px;background-color:rgb(72,161,181);color:white;border-radius:5px;width: 200px">
                            Reset My Password </a>
                    </div>
                </div>`;

        await transporter.sendMail(
            {
                from: '"Q&A" <collardoor.ver@gmail.com>',
                to: req.body.email,
                subject: 'Reset your Q&A password',
                text: '',
                html: outputMail,
            },
            (err, data) => {
                if (err) throw err;
                else {
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
