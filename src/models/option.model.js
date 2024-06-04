import { connectDB } from "../config/db.js";

export class OptionModel{
    constructor(question, option){
        this.question = question;
        this.option = option;
        this.votes = 0;
        // this.add_vote = `http:localhost:3000/api/options/:optionId/add-vote`
    }

    static async createOption(question, option) {
        const db = await connectDB();
        const newOption = new OptionModel(question, option);
        const result = await db.collection('options').insertOne(newOption);
        newOption._id = result.insertedId;
        return newOption;
    }
       
}



