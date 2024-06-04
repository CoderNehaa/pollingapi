import { ObjectId } from "mongodb";
import { connectDB } from "../config/db.js";

export class OptionModel{
    constructor(question, option){
        this.question = question;
        this.option = option;
        this.votes = 0;
        this.add_vote = ""
    }
    
    static async createOption(question, option) {
        const db = await connectDB();
        const newOption = new OptionModel(question, option);
        const result = await db.collection('options').insertOne(newOption);

        const objectId = new ObjectId(result.insertedId);
        const addVoteURL = `http:localhost:3000/api/options/${newOption._id}/add-vote`;
    
        await db.collection('options').updateOne(
            { _id: objectId },
            { $set: { add_vote: addVoteURL } }
        );
        
        const updatedOption = await db.collection('options').findOne({ _id: objectId });
        return updatedOption;
    }  

}



