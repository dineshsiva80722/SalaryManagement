'use server'

import PostModel from '../models/postModel';
import connectDB from '../config/database';

export async function getPosts() {
    try{
        await connectDB();
        const data = JSON.stringify(await PostModel.find());
        console.log(data)

        return {data}
    } catch (error) {
        return {errMsg:  error.message}
    }
}
