import { connectDB } from "../config/db.js";

export class QuestionModel{
    constructor(title){
        this.title = title;
        this.options = [];
    }
    
    
    static async createQuestion(title) {
        const db = await connectDB();
        const existingQuestion = await db.collection('questions').findOne({ title });
        if (existingQuestion) {
            throw new Error('Question already exists');
        }
        const newQuestion = new QuestionModel(title);
        const result = await db.collection('questions').insertOne(newQuestion);
        newQuestion._id = result.insertedId;
        return newQuestion;
    }
    
}


