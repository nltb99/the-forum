const express = require('express');
const mongoose = require('mongoose');
const slugify = require('slugify');

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
    comments: [
        {
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
            createdCommentAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    author: {
        type: String,
        trim: true,
        required: true,
    },
});

questionSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('QuestionSchema', questionSchema);
