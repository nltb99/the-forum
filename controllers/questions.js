const express = require('express')
const route = express.Router()
const QuestionSchema = require('../model/questionSchema.js')

// Handle question route
route.get('/question', async (req, res) => {
    try {
        const question = await QuestionSchema.find({}).sort({ createAt: -1 })
        res.json(question)
    } catch (e) {
        console.log(e)
    }
})

route.get('/question/:id', async (req, res) => {
    try {
        const question = await QuestionSchema.findById(req.params.id)
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
        }
        const schema = await new QuestionSchema(question)
        await schema.save()
        res.send('success')
    } catch (e) {
        console.log(e)
        return res.status(404).json({ msg: 'Can not add!' })
    }
})

route.delete('/question/:id', checkMatchId, async (req, res) => {
    try {
        await req.question.remove()
        res.send('delete successed')
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
            res.status(404).json({ msg: 'Not Found' })
            return
        }
        req.question = questionId
    } catch (e) {
        console.log(e)
    }
    next()
}

module.exports = route
