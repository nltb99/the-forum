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

        // Set data to Redis
        // client.setex('fetchAllQuestions', 2000, JSON.stringify(questions));
        res.json(questions);
    } catch (e) {
        console.log(e);
    }
});

route.get('/question/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const question = await QuestionSchema.findById(req.params.id);
        res.json(question);
    } catch (e) {
        console.log(e);
    }
});

// route.get('/question/quantity/:counting', async (req, res) => {
//     try {
//         const quantityQuestion = await QuestionSchema.countDocuments(req.params.counting);
//         res.status(200).json(quantityQuestion);
//     } catch (e) {
//         console.log(e);
//         return res.status(404).json({ msg: 'Not found' });
//     }
// });

route.post('/question', authPrivilege, async (req, res) => {
    try {
        const question = {
            title: req.body.title,
            detail: req.body.detail,
            author: req.username,
        };
        const schema = await new QuestionSchema(question);
        await schema.save();

        // Update fetchAllQuestions
        // await client.get('fetchAllQuestions', (err, data) => {
        //     if (err) throw err;
        //     let parsedData = JSON.parse(data);
        //     parsedData.push(schema);
        //     client.setex('fetchAllQuestions', 2000, JSON.stringify(parsedData));
        // });

        res.send('success');
    } catch (e) {
        console.log(e);
        return res.status(404).json({ msg: 'Can not add!' });
    }
});

route.delete('/question', authPrivilege, async (req, res) => {
    try {
        await QuestionSchema.findById(req.body.id).then((question) => {
            if (!question) return res.status(404).json({ msg: 'Question not exists' });
            if (question.author !== req.username) {
                return res.status(403).json({ msg: 'Not Allow To Delete' });
            } else {
                // Delete question in redis
                // let { id } = req.params;
                // client.get('fetchAllQuestions', (err, data) => {
                //     if (err) throw err;
                //     let parsedData = JSON.parse(data);
                //     let newParsedDataArray = parsedData.filter((data) => data._id !== id);
                //     client.setex('fetchAllQuestions', 2000, JSON.stringify(newParsedDataArray));
                // });

                question.remove();
                return res.json({ msg: 'Delete succeed!' });
            }
        });
    } catch (e) {
        console.log(e);
    }
});

route.patch('/question/:id', authPrivilege, checkMatchId, async (req, res) => {
    try {
        let { id } = await req.params;
        await QuestionSchema.findById(req.params.id).then((question) => {
            if (question.author != req.username) {
                return res.status(403).json({ msg: 'Not Allow To Update' });
            } else {
                if (req.body.title !== null) req.question.title = req.body.title;
                if (req.body.detail !== null) req.question.detail = req.body.detail;
                req.question.save();
                res.status(200).json({ msg: 'Update succeed!' });
            }
        });
    } catch (e) {
        console.log(e);
    }
});

async function checkMatchId(req, res, next) {
    try {
        const questionId = await QuestionSchema.findById(req.params.id);
        if (questionId === null) {
            return res.status(404).json({ msg: 'Not Found' });
        }
        req.question = questionId;
    } catch (e) {
        console.log(e);
    }
    next();
}

module.exports = route;
