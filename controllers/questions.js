const express = require('express'),
    route = express.Router(),
    QuestionSchema = require('../model/questionSchema.js'),
    { authPrivilege } = require('./globalServer/authFunc');

route.get('/question', async (req, res) => {
    try {
        const questions = await QuestionSchema.find({}).sort({ createAt: -1 });
        return res.status(200).json(questions);
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
    } catch (e) {
        return res.status(401).json({ msg: 'Add question failed!' });
    }
});

route.delete('/question', authPrivilege, (req, res) => {
    try {
        QuestionSchema.findById({ _id: req.body.id }).then((question) => {
            if (!question) return res.status(404).json({ msg: 'Question not exists' });
            if (
                req.role === '\u0041\u0044\u004D\u0049\u004E' ||
                (req.role === '\u0042\u0041\u0053\u0049\u0043' && question.author === req.username)
            ) {
                question.remove();
                return res.status(200).json({ msg: 'Delete succeed!' });
            } else {
                return res.status(403).json({ msg: 'Not Allow To Delete' });
            }
        });
    } catch (e) {
        return res.status(400).json({ msg: 'Delete failed!' });
    }
});

route.patch('/question', authPrivilege, async (req, res) => {
    try {
    } catch (e) {
        return res.status(404).json({ msg: 'Question not found' });
    }
});

module.exports = route;
