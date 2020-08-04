// const express = require('express')
// const mongoose = require('mongoose')
// const slugify = require('slugify')
//
// const commentSchema = mongoose.Schema({
//     title: {
//         type: String,
//         required: true,
//     },
//     comment: {
//         type: String,
//         required: true,
//     },
//     createAt: {
//         type: Date,
//         default: Date.now,
//     },
//     slug: {
//         type: String,
//         required: true,
//     },
// })
//
// commentSchema.pre('validate', function(next) {
//     if (this.title) {
//         this.slug = slugify(this.title, { lower: true, strict: true })
//     }
//
//     next()
// })
//
// module.exports = mongoose.model('CommentSchema', commentSchema)
