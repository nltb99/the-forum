const express = require('express');
const mongoose = require('mongoose');
const slugify = require('slugify');

const commentSchema = mongoose.Schema({
    comment: {
        type: String,
        trim: true,
        required: false,
    },
    owner: {
        type: String,
        trim: true,
        required: false,
    },
    voteComment: {
        vote: {
            type: Number,
            default: 0,
            required: true,
        },
        whomvote: [
            {
                whom: String,
                state: Boolean,
            },
        ],
    },
    createdCommentAt: {
        type: Date,
        default: Date.now,
    },
});

const questionSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    detail: {
        type: String,
        trim: true,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    slug: {
        type: String,
        trim: true,
        required: true,
    },
    comments: [commentSchema],
    author: {
        type: String,
        trim: true,
        required: true,
    },
    voteQuestion: {
        vote: {
            type: Number,
            default: 0,
            required: true,
        },
        whomvote: [
            {
                whom: String,
                state: Boolean,
            },
        ],
    },
});

questionSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('QuestionSchema', questionSchema);
