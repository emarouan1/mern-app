import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema({
    username : { type : String, required: true,unique: true},
    email : { type : String, required: true,unique: true, select: false}, //select : false, when fetching data from database doesnt show password in UI
    password : { type : String, required: true, select : false},
});

type User = InferSchemaType<typeof userSchema>;

export default model<User> ("User", userSchema);