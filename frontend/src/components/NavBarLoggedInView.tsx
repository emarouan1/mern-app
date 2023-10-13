import { Button, Navbar } from "react-bootstrap";
import { User } from "../models/user";
import * as NotesApi from "../network/notes_api";

interface NavBarLoggedInVieProps{
    user: User,
    onLogoutSuccessful: () => void,
}

const NavBarLoggedInView = ({user,onLogoutSuccessful}:NavBarLoggedInVieProps) => {

    async function logout() {
        try {
            await NotesApi.logout();
            onLogoutSuccessful();
        } catch (error) {
            console.error(error);
            alert(error);

        }
    }

    return (
        <>
        <Navbar.Text className="me-2">
            Logged in as : {user.username}
        </Navbar.Text>
        <Button onClick={logout}>
            Log Out
        </Button>
        </>
     );
}
 
export default NavBarLoggedInView;