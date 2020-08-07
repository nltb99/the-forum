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

route.delete('/question', authPrivilege, async (req, res) => {
    try {
        return await QuestionSchema.findById({ _id: req.body.id }).then((question) => {
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
        return await QuestionSchema.findById(req.body.id).then((question) => {
            if (!question) return res.status(404).json({ msg: 'Question not found' });
            if (req.username !== question.author)
                return res.status(403).json({ msg: 'Not allow!' });
            if (!req.body.title) question.title = req.body.title;
            if (!req.body.detail) question.title = req.body.detail;
            question.save();
            return res.status(200).json({ msg: 'Update succeed!' });
        });
    } catch (e) {
        return res.status(404).json({ msg: 'Error' });
    }
});

route.patch('/question/increaselike', authPrivilege, async (req, res) => {
    try {
        return await QuestionSchema.findById(req.body.id).then((question) => {
            if (!question) return res.status(404).json({ msg: 'Question not found' });
            if (req.username === null) return res.status(403).json({ msg: 'Token require' });
            if (question.voteQuestion.whomvote.some((e) => e.whom == req.username)) {
                let filterQuestion = question.voteQuestion.whomvote.filter(
                    (e) => e.whom == req.username,
                );
                if (!filterQuestion[0].state) {
                    // unliked
                    question.voteQuestion.vote += 2;
                    filterQuestion[0].state = true;
                    question.save();
                    return res.status(200).json({ msg: 'Love Succeed' });
                } else {
                    return res.status(204);
                }
            } else {
                question.voteQuestion.vote += 1;
                question.voteQuestion.whomvote = [
                    ...question.voteQuestion.whomvote,
                    { whom: req.username, state: true },
                ];
                question.save();
                return res.status(200).json({ msg: 'Love Succeed' });
            }
        });
    } catch (e) {
        return res.status(404).json({ msg: 'Error!' });
    }
});

route.patch('/question/decreaselike', authPrivilege, async (req, res) => {
    try {
        return await QuestionSchema.findById(req.body.id).then((question) => {
            if (!question) return res.status(404).json({ msg: 'Question not found' });
            if (req.username === null) return res.status(403).json({ msg: 'Token require' });
            if (question.voteQuestion.whomvote.some((e) => e.whom === req.username)) {
                let filterQuestion = question.voteQuestion.whomvote.filter(
                    (e) => e.whom == req.username,
                );
                if (filterQuestion[0].state) {
                    //Liked
                    question.voteQuestion.vote -= 2;
                    filterQuestion[0].state = false;
                    question.save();
                    return res.status(200).json({ msg: 'Unlove Succeed' });
                } else {
                    return res.status(204);
                }
            } else {
                question.voteQuestion.vote -= 1;
                question.voteQuestion.whomvote = [
                    ...question.voteQuestion.whomvote,
                    { whom: req.username, state: false },
                ];
                question.save();
                return res.status(200).json({ msg: 'Unlove Succeed' });
            }
        });
    } catch (e) {
        return res.status(404).json({ msg: 'Error!' });
    }
});

module.exports = route;
