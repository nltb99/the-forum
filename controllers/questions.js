const express = require('express')
const route = express.Router()
const QuestionSchema = require('../model/questionSchema.js')

const authToken = require('./verifyToken/token')

const client = require('./redis/redisClient')

// Cache middleware
function cacheAllQuestion(req, res, next) {
    client.get('fetchAllQuestions', (err, data) => {
        if (err) throw err
        if (data !== null) {
            res.json(JSON.parse(data))
        } else {
            next()
        }
    })
}

// function cacheSpecificQuestion(req, res, next) {
//     const { id } = req.params
//     client.get(id, (err, data) => {
//         if (err) throw err
//         if (data !== null) {
//             res.json(JSON.parse(data))
//         } else {
//             next()
//         }
//     })
// }

/////////////////////////////////

// Handle question route
route.get('/question', cacheAllQuestion, async (req, res) => {
    try {
        const questions = await QuestionSchema.find({}).sort({ createAt: -1 })

        // Set data to Redis
        client.setex('fetchAllQuestions', 2000, JSON.stringify(questions))
        res.json(questions)
    } catch (e) {
        console.log(e)
    }
})

route.get('/question/:id', async (req, res) => {
    try {
        const { id } = req.params
        const question = await QuestionSchema.findById(req.params.id)

        // Set data to Redis
        // client.setex(id, 2000, JSON.stringify(question))
        res.json(question)
    } catch (e) {
        console.log(e)
    }
})

route.get('/question/quantity/:counting', async (req, res) => {
    try {
        const quantityQuestion = await QuestionSchema.countDocuments(req.params.counting)
        res.status(200).json(quantityQuestion)
    } catch (e) {
        console.log(e)
        return res.status(404).json({ msg: 'Not found' })
    }
})

route.post('/question', async (req, res) => {
    try {
        const question = {
            title: req.body.title,
            detail: req.body.detail,
            author: req.body.author,
        }
        const schema = await new QuestionSchema(question)
        await schema.save()

        // Update fetchAllQuestions
        await client.get('fetchAllQuestions', (err, data) => {
            if (err) throw err
            let parsedData = JSON.parse(data)
            parsedData.push(schema)
            client.setex('fetchAllQuestions', 2000, JSON.stringify(parsedData))
        })

        res.send('success')
    } catch (e) {
        console.log(e)
        return res.status(404).json({ msg: 'Can not add!' })
    }
})

route.delete('/question/:id', checkMatchId, async (req, res) => {
    try {
        await req.question.remove()
        // Delete question in redis
        const { id } = await req.params
        await client.get('fetchAllQuestions', (err, data) => {
            if (err) throw err
            let parsedData = JSON.parse(data)
            let newParsedDataArray = parsedData.filter((data) => data._id !== id)
            client.setex('fetchAllQuestions', 2000, JSON.stringify(newParsedDataArray))
        })

        return res.send('delete successed')
    } catch (e) {
        console.log(e)
    }
})

route.patch('/question/:id', checkMatchId, async (req, res) => {
    if (req.body.title != null) {
        req.question.title = req.body.title
    }

    if (req.body.detail != null) {
        req.question.detail = req.body.detail
    }
    try {
        let updateQuestion = await req.question.save()
        res.send('Update successed')
    } catch (e) {
        console.log(e)
    }
})

async function checkMatchId(req, res, next) {
    try {
        const questionId = await QuestionSchema.findById(req.params.id)
        if (questionId == null) {
            return res.status(404).json({ msg: 'Not Found' })
        }
        req.question = questionId
    } catch (e) {
        console.log(e)
    }
    next()
}

module.exports = route
