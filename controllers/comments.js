const express = require('express')
const route = express.Router()
const CommentSchema = require('../model/commentSchema.js')

// Handle route
route.get('/comment', async (req, res) => {
    try {
        const comments = await CommentSchema.find({})
        res.json(comments)
    } catch (e) {
        console.log(e)
    }
})

route.get('/comment/:slug', async (req, res) => {
    try {
        const comments = await CommentSchema.find({ slug: req.params.slug })
        res.json(comments)
    } catch (e) {
        console.log(e)
    }
})

route.get('/comment/quantity/:slug', async (req, res) => {
    try {
        const quantity = await CommentSchema.countDocuments({ slug: req.params.slug })
        res.json(quantity)
    } catch (e) {
        console.log(e)
        return res.status(404).json({ msg: 'Not found' })
    }
})

route.post('/comment', async (req, res) => {
    try {
        const newComment = await CommentSchema({
            title: req.body.title,
            comment: req.body.comment,
        })

        await newComment.save()
        res.json({ msg: 'Succeed' })
    } catch (e) {
        console.log(e)
        return res.status(404).json({ msg: 'Cannot post comment' })
    }
})

route.delete('/comment/specific/:id', checkMatchIdComment, async (req, res) => {
    try {
        await req.comment.remove()
        res.status(200).json({ msg: 'Delete Succeed' })
    } catch (e) {
        console.log(e)
    }
})

route.delete('/comment/:slug', async (req, res) => {
    try {
        await CommentSchema.deleteMany({ slug: req.params.slug })
        res.status(200).json({ msg: 'Delete Succeed' })
    } catch (e) {
        console.log(e)
        return res.status(404).json({ msg: 'Not Found' })
    }
})

async function checkMatchIdComment(req, res, next) {
    const commentId = await CommentSchema.findById(req.params.id)
    if (commentId == null) {
        return res.status(404).json({ msg: 'Not found' })
    }
    req.comment = commentId
    next()
}

module.exports = route
