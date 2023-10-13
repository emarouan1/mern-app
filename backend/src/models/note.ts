import { InferSchemaType, Schema, model } from "mongoose";

const noteSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, required : true}, // lier les users avec leur propre notes par ID
    title : {type:String, required:true}, // insertion du titre est obligatoir (required)
    text: {type:String},
}, {timestamps:true}); // mise a jour schema automatiquement

type Note = InferSchemaType<typeof noteSchema>;
export default model<Note>("Note", noteSchema);