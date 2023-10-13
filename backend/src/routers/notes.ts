import express from "express";
import * as NotesController from "../controllers/notes";
// import { getNotes } from "../controllers/notes";

const router = express.Router();

//fetch data from server
router.get("/", NotesController.getNotes); 

// search for specific notes by id
router.get("/:noteId", NotesController.getNote);

//sending data to the server
router.post("/", NotesController.creatNote);

//update a resource, set an endpoint for it and update it by ID via URL argument 
router.patch("/:noteId", NotesController.updateNote);

//Delete note
router.delete("/:noteId", NotesController.deleteNote);

export default router;
// app.get("/", getNotes);