import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";
import { OptionModel } from "../models/option.model.js";

export class OptionController {
    constructor(){
        this.findQuestionByOptionId = this.findQuestionByOptionId.bind(this)
        this.addVotes = this.addVotes.bind(this)
    }

    async addOption(req, res) {
        try {
            const { questionId } = req.params;
            const { option } = req.body;

            const objectId = new ObjectId(questionId);

            const db = await connectDB();
            const existingQuestion = await db.collection('questions').findOne({ _id: objectId });
            if (!existingQuestion) {
                res.status(404).send("Question does not exist");
                return;
            }

            const dbOption = await db.collection('options').findOne({ option });
            if (dbOption) {
                res.status(400).send("Option already exists");
                return;
            }
            
            const newOption = await OptionModel.createOption(questionId, option);

            await db.collection('questions').updateOne(
                { _id: objectId },
                { $push: { options: newOption } }
            );

            res.status(201).send(newOption);
        } catch (e) {
            console.log(e);
            res.status(500).send("Error occurred while creating option");
        }
    }

    async getOptionByQuesId(req, res) {
        try {
            const { questionId } = req.params;
            
            const db = await connectDB();
            const results = await db.collection('options').find({ question: questionId }).toArray();
            res.status(200).send(results);
        } catch (e) {
            console.log(e);
            res.status(503).send("Error occurred while getting options");
        }
    }

    async findQuestionByOptionId(id){
        const db = await connectDB();
        const objectId = new ObjectId(id);
        
        const option = await db.collection('options').findOne({_id : objectId});
        const questionId = option.question;

        const quesObjId = new ObjectId(questionId);
        const question = await db.collection('questions').findOne({_id:quesObjId});

        return question

    }
    
    async addVotes(req, res) {
        try {
            const { optionId } = req.params;
            const objectId = new ObjectId(optionId);
    
            const db = await connectDB();
            await db.collection('options').updateOne(
                { _id: objectId },
                { $inc: { votes: 1 } }
            );
    
            const question = await this.findQuestionByOptionId(optionId);
            
            if (question) {
                question.options.forEach(option => {
                    if (option._id.equals(objectId)) {
                        option.votes += 1;
                    }
                });
    
                await db.collection('questions').updateOne(
                    { _id: question._id },
                    { $set: { options: question.options } }
                );
            }
    
            res.status(200).send("Vote added");
        } catch (e) {
            console.log(e);
            res.status(503).send("Error occurred while adding vote");
        }
    }
    
    async deleteOption(req, res) {
        try {
            const { optionId } = req.params;
            const objectId = new ObjectId(optionId);
            
            const db = await connectDB();
    
            const option = await db.collection('options').findOne({ _id: objectId });
    
            if (!option) {
                return res.status(404).send("Option not found");
            }
            
            // 
            if(option.votes > 0){
                return res.status(400).send("Option with vote cannot be deleted");
            }

            const questionId = option.question;
            const quesObjId = new ObjectId(questionId);
            const question = await db.collection('questions').findOne({ _id: quesObjId });
    
            if (!question) {
                return res.status(404).send("Question not found");
            }
    
            const updatedOptions = question.options.filter(opt => opt._id.toString() !== optionId);
    
            await db.collection('questions').updateOne(
                { _id: quesObjId },
                { $set: { options: updatedOptions } }
            );
    
            await db.collection('options').deleteOne({ _id: objectId });
    
            res.status(200).send("Option deleted");
        } catch (e) {
            console.log(e);
            res.status(500).send("Internal Server Error");
        }
    }    
        
}

