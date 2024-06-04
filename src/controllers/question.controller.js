import { connectDB } from "../config/db.js";
import { QuestionModel } from "../models/question.model.js";
import { ObjectId } from "mongodb";

export class QuestionController{
    async getQuestionById(req, res) {
        try {
            const { questionId } = req.params;
            const db = await connectDB();
            const result = await db.collection('questions').findOne({ _id: new ObjectId(questionId) });
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(404).send("Question not found");
            }
        } catch (e) {
            console.log(e);
            res.status(500).send("Error occurred while getting question");
        }
    }

    async createQuestion(req, res) {
        try {
            const { title } = req.body;
            const newQuestion = await QuestionModel.createQuestion(title);
            res.status(201).send(newQuestion);
        } catch (e) {
            console.log(e);
    
            if (e.message === 'Question already exists') {
                res.status(400).send(e.message);
            } else {
                res.status(500).send("Error occurred while creating question");
            }
        }
    }
    
    async deleteQuestion(req, res) {
        try {
            const { questionId } = req.params;
            const db = await connectDB();
            const result = await db.collection('questions').deleteOne({ _id: new ObjectId(questionId) });
            if (result.deletedCount === 1) {
                res.status(200).send("Question deleted");
            } else {
                res.status(404).send("Question not found");
            }
        } catch (e) {
            console.log(e);
            res.status(500).send("Error occurred while deleting question");
        }
    }

}


