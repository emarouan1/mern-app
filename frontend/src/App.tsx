import {useState, useEffect} from "react";
import { Container } from "react-bootstrap";
import Typewriter from "typewriter-effect";
import NavBar from "./components/NavBar";
import SignUpModal from "./components/SignUpModal";
import LoginModal from "./components/loginModul";
import styles from "./styles/NotesPage.module.css";
import { User } from "./models/user";
import * as NotesApi from "./network/notes_api";
import NotesPageLoggedInView from "./components/NotesPageLoggedInView";
import NotsPageLoggedOutView from "./components/NotsPageLoggedOutView";
import MansImageList from "./components/fpage";


function App() {

  const [loggedInUser, setloggedInUser] = useState<User | null>(null);
  const [showSignUpModal, setshowSignUpModal] = useState(false);
  const [showLogginModal, setshowLogginModal] = useState(false);

  useEffect(()=>{
    async function fetchLoggedInUser() {
      try {
        const user = await NotesApi.getLoggedInUser();
        setloggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLoggedInUser();
  }, []);


  return (
    <div>
      
      <NavBar
        loggedInUser={loggedInUser}
        onLoginClicked={() => setshowLogginModal(true)}
        onSignUpClicked={() => setshowSignUpModal(true)}
        onLogoutSuccessful={() => setloggedInUser(null)}
      />
      <Container className={styles.notesPage}>
        <>
        {
          loggedInUser
          ? <NotesPageLoggedInView />
          : <NotsPageLoggedOutView />
          
        }
        <MansImageList />
        
        </>
      </Container>
      {
          showSignUpModal && 
          <SignUpModal
          onDismiss={()=>setshowSignUpModal(false)}
          onSignUpSucceessful={(user)=>{
            setloggedInUser(user);
            setshowSignUpModal(false);
           }}
          />
        }
        {
          showLogginModal && 
          <LoginModal 
          onDismiss={()=>setshowLogginModal(false)}
          onLoginSuccessful={(user)=>{ 
            setloggedInUser(user);
            setshowLogginModal(false);
          }}
          />
        }
       
      {/* <footer>
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 30 }}
          >
            <Typewriter
              options={{
                autoStart: true,
                loop: true,
                delay: 40,

                strings: ["", "MERN PROJECT", "2023 BY MAROUANE"],
              }}
            />

            <h5>&copy;</h5>
          </div>
        </footer> */}
        
    </div>
  );
}

export default App;
