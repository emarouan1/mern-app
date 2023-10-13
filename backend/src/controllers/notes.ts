import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";

export const getNotes: RequestHandler = async (req, res,next) => {
    const authenticatedUserId = req.session.userId;
   
    try {

        assertIsDefined(authenticatedUserId);

      //throw Error("oups !!");
      //throw createHttpError(401);
      
      const notes = await NoteModel.find({userId:authenticatedUserId}).exec(); // get data from server
      res.status(200).json(notes); //return data to the user and send the response in form of json file
    } catch (error) {
      next(error);
    }
  }

export const getNote: RequestHandler =async (req, res, next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;


    try {
        assertIsDefined(authenticatedUserId);

        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400,"Invalide Note ID")
        }

        const note = await NoteModel.findById(noteId).exec(); // search note by id, special mongoose function to search by id, .exec to to turn this into real promise

        if(!note){
            throw createHttpError(404,"Note not found");
        }
        if(!note.userId.equals(authenticatedUserId)){

            throw createHttpError(401, "You cannot access this Note!!")
        }
        res.status(200).json(note); //return result
    } catch (error) {
        next(error);
    }
}

interface CreatNoteBody {
    title?:string;
    text?:string;
}


  export const creatNote: RequestHandler<unknown, unknown, CreatNoteBody, unknown> =async (req,res,next) => {
    const title = req.body.title;
    const text = req.body.text;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if(!title){
            throw createHttpError(400, "Note must have a title !");
        }
        //creation of notes
        const newNote = await NoteModel.create({
            userId: authenticatedUserId,
            title: title,
            text: text,
        });

        res.status(201).json(newNote); // send response back to the user, "201 :new resource created"
        
    } catch (error) {
        next(error);
    }
  };

  // Updating and Deleting notes :

interface UpdateNoteParams {
    noteId : string,
}

interface UpdateNoteBody {
    title? : string,
    text? : string,
}

  export const updateNote: RequestHandler<UpdateNoteParams,unknown, UpdateNoteBody, unknown> =async (req,res,next) => {
    const noteId =  req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400,"Invalide Note ID");
        }

        if(!newTitle){
            throw createHttpError(400, "Note must have a title !");
        }

        const note = await NoteModel.findById(noteId).exec();

        if(!note){
            throw createHttpError(404,"Note Not Found")
        }
        if(!note.userId.equals(authenticatedUserId)){

            throw createHttpError(401, "You cannot access this Note!!")
        }

        note.title = newTitle;
        note.text = newText;

        const updatedNote = await note.save(); //edite note


        // other option to edite
        //NoteModel.findByIdAndUpdate(noteId);

        //return the updated note
        res.status(200).json(updatedNote);


    } catch (error) {
        next(error);
    }
  }

export const deleteNote : RequestHandler = async (req,res,next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400,"Invalide Note ID");
        }
        
        const note = await NoteModel.findById(noteId).exec();

        if(!note){
            throw createHttpError(404,"Note not Found");
        }
        if(!note.userId.equals(authenticatedUserId)){

            throw createHttpError(401, "You cannot access this Note!!")
        }

        await note.deleteOne(); // delete note

        res.sendStatus(204);

    } catch (error) {
        next(error)
    }
  };