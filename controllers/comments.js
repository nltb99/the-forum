const express = require('express'),
    route = express.Router(),
    QuestionSchema = require('../model/questionSchema.js'),
    { authPrivilege } = require('./globalServer/authFunc');

route.patch('/comment/insert', authPrivilege, async (req, res) => {
    try {
        return await QuestionSchema.findOne({ _id: req.body.id }).then((question) => {
            if (!question) return res.status(404).json({ msg: 'Question not found!' });
            question.comments = [
                ...question.comments,
                { comment: req.body.comment, owner: req.username },
            ];
            question.save();
            return res.status(200).json({ msg: 'Insert succeed!' });
        });
    } catch (e) {
        return res.status(400).json({ msg: 'Insert failed!' });
    }
});

route.patch('/comment/delete', authPrivilege, async (req, res) => {
    try {
        return await QuestionSchema.findOne({ _id: req.body.id }).then((question) => {
            if (!question) return res.status(404).json({ msg: 'Question not found!' });
            if (!question.comments.some((e) => e._id == req.body.idComment))
                return res.status(404).json({ msg: 'Comment not found!' });
            if (
                req.role === '\u0041\u0044\u004D\u0049\u004E' ||
                (req.role === '\u0042\u0041\u0053\u0049\u0043' &&
                    question.comments.some((e) => e.owner == req.username))
            ) {
                question.comments = question.comments.filter((e) => e._id != req.body.idComment);
                question.save();
                return res.status(200).json({ msg: 'Delete succeed!' });
            } else return res.status(403).json({ msg: 'Not allow to delete !' });
        });
    } catch (e) {
        return res.status(400).json({ msg: 'Delete failed!' });
    }
});

route.patch('/comment/increaselike', authPrivilege, async (req, res) => {
    try {
        return await QuestionSchema.findById(req.body.id).then((question) => {
            if (!question) return res.status(404).json({ msg: 'Question not found' });
            if (req.username === null) return res.status(403).json({ msg: 'Token require' });
            const commentsFilter = question.comments.filter((e) => e._id == req.body.idComment)[0];
            console.log(commentsFilter);
            if (commentsFilter.voteComment.whomvote.some((e) => e.whom == req.username)) {
                let whomeloveFilter = commentsFilter.voteComment.whomvote.filter(
                    (e) => e.whom == req.username,
                );
                if (!whomeloveFilter[0].state) {
                    // unliked
                    commentsFilter.voteComment.vote += 2;
                    whomeloveFilter[0].state = true;
                    question.save();
                    return res.status(200).json({ msg: 'Vote up comment succeed' });
                } else {
                    return res.status(204);
                }
            } else {
                commentsFilter.voteComment.vote += 1;
                commentsFilter.voteComment.whomvote = [
                    ...commentsFilter.voteComment.whomvote,
                    { whom: req.username, state: true },
                ];
                question.save();
                return res.status(200).json({ msg: 'Vote up comment succeed' });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(404).json({ msg: 'Error!' });
    }
});

route.patch('/comment/decreaselike', authPrivilege, async (req, res) => {
    try {
        return await QuestionSchema.findById(req.body.id).then((question) => {
            if (!question) return res.status(404).json({ msg: 'Question not found' });
            if (req.username === null) return res.status(403).json({ msg: 'Token require' });
            const commentsFilter = question.comments.filter((e) => e._id == req.body.idComment)[0];
            console.log(commentsFilter);
            if (commentsFilter.voteComment.whomvote.some((e) => e.whom == req.username)) {
                let whomeloveFilter = commentsFilter.voteComment.whomvote.filter(
                    (e) => e.whom == req.username,
                )[0];
                if (whomeloveFilter.state) {
                    // liked
                    commentsFilter.voteComment.vote -= 2;
                    whomeloveFilter.state = false;
                    question.save();
                    return res.status(200).json({ msg: 'Vote down comment succeed' });
                } else {
                    return res.status(204);
                }
            } else {
                commentsFilter.voteComment.vote -= 1;
                commentsFilter.voteComment.whomvote = [
                    ...commentsFilter.voteComment.whomvote,
                    { whom: req.username, state: false },
                ];
                question.save();
                return res.status(200).json({ msg: 'Vote down comment succeed' });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(404).json({ msg: 'Error!' });
    }
});

module.exports = route;
