import './App.css';
import Login from './components/Login';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {useState, useEffect} from "react";
import Dashboard from "./components/Dashboard";

function App() {
    const clientId = '636691899293-isn39g0gndn8upp8m04unmnsc2uaq5a8.apps.googleusercontent.com';
    const [login, setLogin] = useState(false);

    useEffect(() => {
        const loggedIn = localStorage.getItem('loggedIn');
        if (loggedIn) {
            setLogin(true);
        }
    }, []);

    return (
        // Reference: https://www.npmjs.com/package/@react-oauth/google
        <GoogleOAuthProvider clientId={clientId}>
            <div className="App">
                {login ? <Dashboard setLogin={setLogin}></Dashboard>
                    : <Login setLogin={setLogin}></Login>}
            </div>
        </GoogleOAuthProvider>
    );
}

export default App;
