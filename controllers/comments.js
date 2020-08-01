const express = require('express')
const route = express.Router()
const CommentSchema = require('../model/commentSchema.js')

const client = require('./redis/redisClient')

// Cache middleware
function cacheQuantityOfComents(req, res, next) {
    const { slug } = req.params

    client.get(slug + 'quantity', (err, data) => {
        if (err) throw err
        if (data !== null) {
            return res.json(JSON.parse(data))
        } else {
            next()
        }
    })
}

function cacheWholeComments(req, res, next) {
    const { slug } = req.params

    client.get('wholeComments', (err, data) => {
        if (err) throw err
        if (data !== null) {
            return res.json(JSON.parse(data))
        } else {
            next()
        }
    })
}

// Handle route
route.get('/comment', cacheWholeComments, async (req, res) => {
    try {
        const comments = await CommentSchema.find({})

        // Set data to Redis
        client.setex('wholeComments', 2000, JSON.stringify(comments))

        return res.json(comments)
    } catch (e) {
        console.log(e)
        return
    }
})

route.get('/comment/:slug', async (req, res) => {
    try {
        const comments = await CommentSchema.find({ slug: req.params.slug })
        const { slug } = req.params

        // Set data to Redis
        client.setex('wholeComments', 2000, JSON.stringify(comments))

        return res.json(comments)
    } catch (e) {
        console.log(e)
        return
    }
})

route.get('/comment/quantity/:slug', cacheQuantityOfComents, async (req, res) => {
    try {
        const quantity = await CommentSchema.countDocuments({ slug: req.params.slug })

        // Set data to Redis
        const { slug } = req.params
        client.setex(slug + 'quantity', 2000, JSON.stringify(quantity))
        return res.json(quantity)
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

        //Update Redis
        client.get('wholeComments', (err, data) => {
            if (err) throw err
            let parsedData = JSON.parse(data)
            parsedData.push(newComment)
            client.setex('wholeComments', 2000, JSON.stringify(parsedData))
            // Update amount
            let newFilterParsedData = parsedData.filter((data) => data.slug === newComment.slug)
            client.setex(
                newComment.slug + 'quantity',
                2000,
                JSON.stringify(newFilterParsedData.length),
            )
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

        // Delete question in redis
        const { id } = await req.params
        await client.get('wholeComments', (err, data) => {
            if (err) throw err
            let parsedData = JSON.parse(data)
            let newArrayAfterDelete = parsedData.filter((data) => data._id !== id)
            client.setex('wholeComments', 2000, JSON.stringify(newArrayAfterDelete))
            // Update amount
            let filterSlug = parsedData.filter((data) => data._id === id)
            let newFilterParsedData = parsedData.filter((data) => data.slug === filterSlug[0].slug)
            client.setex(
                filterSlug[0].slug + 'quantity',
                2000,
                JSON.stringify(newFilterParsedData.length),
            )
            console.log(filterSlug[0].slug)
            console.log(newFilterParsedData)
        })

        return res.status(200).json({ msg: 'Delete Succeed' })
    } catch (e) {
        console.log(e)
    }
})

route.delete('/comment/:slug', async (req, res) => {
    try {
        await CommentSchema.deleteMany({ slug: req.params.slug })

        // Delete question in redis
        const { slug } = await req.params
        await client.get('wholeComments', (err, data) => {
            if (err) throw err
            let parsedData = JSON.parse(data)
            let newParsedDataArray = parsedData.filter((data) => data.slug !== slug)
            client.setex('wholeComments', 2000, JSON.stringify(newParsedDataArray))
        })

        return res.status(200).json({ msg: 'Delete Succeed' })
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
