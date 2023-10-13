import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { Note as NoteModel } from "../models/notes";
import * as NotesApi from "../network/notes_api";
import styles from "../styles/NotesPage.module.css";
import styleUtils from "../styles/utils.module.css";
import AddEditNotesDialog from "./AddEditNotesDialog";
import Note from "./notes";


const NotesPageLoggedInView = () => {

    const [notes, setNotes] = useState<NoteModel[]>([]);
    const [notesLoading, setnotesLoading] = useState(true);
    const [showNotesLoadingError, setshowNotesLoadingError] = useState(false);
  
    const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
    const [NoteToEdit, setNoteToEdit] = useState<NoteModel|null>(null);

    // useEffect to load automaticly
  useEffect(() => {
    // load notes
    async function loadNotes() {
      try {
        setshowNotesLoadingError(false);
        setnotesLoading(true);
        const notes = await NotesApi.fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.error(error);
        setshowNotesLoadingError(true);
      } finally{
        setnotesLoading(false);
      }
    }
    loadNotes();
  }, []);


  async function deleteNote(note:NoteModel) {
    try {
      await NotesApi.deleteNote(note._id);
      setNotes(notes.filter(existingNote => existingNote._id !== note._id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
    
  }

  const noteGrid = 
      <Row className={`g-4 ${styles.noteGrid}`} xs={1} md={2} xl={3}>
        {/* show result of fetched data in console */}

        {notes.map((note) => (
          <Col key={note._id}>
            <Note 
            note={note}
            className={styles.note}
            onNoteClicked={setNoteToEdit}
            onDeleteNoteClicked={deleteNote}
            />
          </Col>
        ))}
      </Row>

    return ( 
        <>
        <Button
        className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
        onClick={() => setShowAddNoteDialog(true)}
      >
        <BiSolidMessageSquareAdd size={18} />
        Add New Note
      </Button>
      {notesLoading && <Spinner animation="border" variant="primary" />}
      {showNotesLoadingError && <p>Something went wrong, please referesh the page</p>}
      {!notesLoading && !showNotesLoadingError &&
      <>
      {
        notes.length > 0
        ? noteGrid
        : <p>You dont have an Notes yet !!</p>
      }
      </>
      }

      {showAddNoteDialog && ( //affiche sur ecran seulemnt si showAddNoteDialog est True
        <AddEditNotesDialog
          onDismiss={() => setShowAddNoteDialog(false)}
          onNoteSaved={(newNote) => {
            setNotes([...notes, newNote]); //creats a new array, adds all existing notes to it, and adds new note to it too
            setShowAddNoteDialog(false); // hide dialog form after pressing button save
          }}
        />
      )}

      {/* show result of fetched raw data
      {JSON.stringify(notes)} */}

      {/* const [clickcount, setClickCount] = useState(1); */}

      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          welcome to note app
          
        </p>
        <p>number of clicks : {clickcount}</p>
        <Button onClick={()=> setClickCount(clickcount +1)}>
          +1
        </Button>
        <br />
        <Button onClick={()=> setClickCount(clickcount -1)}>
          -1
        </Button>
        
      </header> */}
      {NoteToEdit && 
      <AddEditNotesDialog
      noteToEdit={NoteToEdit}
      onDismiss={()=> setNoteToEdit(null)}
      onNoteSaved={(updatedNote) => {
        setNotes(notes.map(existingNote => existingNote._id === updatedNote._id ? updatedNote : existingNote)) // show updated value in UI
        setNoteToEdit(null);

      }}
      />
      }
        </>
     );
}
 
export default NotesPageLoggedInView;