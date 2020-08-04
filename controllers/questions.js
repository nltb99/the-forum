const express = require('express'),
    route = express.Router(),
    QuestionSchema = require('../model/questionSchema.js'),
    jwt = require('jsonwebtoken'),
    UserQandASchema = require('../model/user'),
    { authPrivilege } = require('./globalServer/authFunc'),
    authToken = require('./verifyToken/token');
// client = require('./globalServer/redisClient');

// Cache middleware
// function cacheAllQuestion(req, res, next) {
//     client.get('fetchAllQuestions', (err, data) => {
//         if (err) throw err;
//         if (data !== null) {
//             res.json(JSON.parse(data));
//         } else {
//             next();
//         }
//     });
// }

/////////////////////////////////

// Handle question route
route.get('/question', async (req, res) => {
    try {
        const questions = await QuestionSchema.find({}).sort({ createAt: -1 });
        return res.status(200).json(questions);
        // Set data to Redis
        // client.setex('fetchAllQuestions', 2000, JSON.stringify(questions));
    } catch (e) {
        return res.status(404).json({ msg: 'Error' });
    }
});

route.get('/question/:id', async (req, res) => {
    try {
        const question = await QuestionSchema.findById(req.params.id);
        return res.status(200).json(question);
    } catch (e) {
        return res.status(404).json({ msg: 'Question not found' });
    }
});

route.post('/question', authPrivilege, async (req, res) => {
    try {
        const { title, detail } = await req.body;
        if (!title || !detail) {
            return res.status(400).json({ msg: 'Input must not be null' });
        }
        await new QuestionSchema({ title, detail, author: req.username }).save();
        return res.status(200).json({ msg: 'Add question succeed!' });

        // Update fetchAllQuestions
        // await client.get('fetchAllQuestions', (err, data) => {
        //     if (err) throw err;
        //     let parsedData = JSON.parse(data);
        //     parsedData.push(schema);
        //     client.setex('fetchAllQuestions', 2000, JSON.stringify(parsedData));
        // });
    } catch (e) {
        return res.status(401).json({ msg: 'Add question failed!' });
    }
});

route.delete('/question', authPrivilege, (req, res) => {
    try {
        QuestionSchema.findById({ _id: req.body.id }).then((question) => {
            if (!question) return res.status(404).json({ msg: 'Question not exists' });
            if (question.author !== req.username) {
                return res.status(403).json({ msg: 'Not Allow To Delete' });
            } else {
                question.remove();
                return res.status(200).json({ msg: 'Delete succeed!' });
                // Delete question in redis
                // let { id } = req.params;
                // client.get('fetchAllQuestions', (err, data) => {
                //     if (err) throw err;
                //     let parsedData = JSON.parse(data);
                //     let newParsedDataArray = parsedData.filter((data) => data._id !== id);
                //     client.setex('fetchAllQuestions', 2000, JSON.stringify(newParsedDataArray));
                // });
            }
        });
    } catch (e) {
        return res.status(400).json({ msg: 'Delete failed!' });
    }
});

// authPrivilege
route.patch('/question', authPrivilege, async (req, res) => {
    try {
    } catch (e) {
        return res.status(404).json({ msg: 'Question not found' });
    }
});

module.exports = route;
