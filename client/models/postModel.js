import { Schema, model, models } from 'mongoose';

const postSchema = new Schema({
    title: String,
    content: String,
    author: String,
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const PostModel = models.post || model('Post', postSchema);

export default PostModel;