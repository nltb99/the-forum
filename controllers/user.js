const express = require('express'),
    route = express.Router(),
    jwt = require('jsonwebtoken');
bcrypt = require('bcrypt');

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
            return res.status(204).json({ msg: 'User does not exists' });
        }
        bcrypt.compare(password, user.password, (err, results) => {
            if (err) throw err;
            if (!results) {
                return res.status(206).json({ msg: 'Password does not matchs' });
            } else if (results) {
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
                return res.status(200).json({ msg: 'Login Succeed!' });
            }
        });
    });
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

module.exports = route;
