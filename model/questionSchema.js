const express = require('express');
const mongoose = require('mongoose');
const slugify = require('slugify');

const questionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    detail: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    slug: {
        type: String,
        required: true,
    },
    author: {
        type: String,
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
