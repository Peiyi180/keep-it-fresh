import {GoogleLogin} from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import axios from "axios";
import {HOST} from "../constants";

function Login(props) {
    const {setLogin} = props

    function handleLogin(email, name) {
        axios.post(`${HOST}/login`, {
            email: email,
            name: name
        }).then(res => {
            const uid = JSON.parse(res.data.body)['uid']
            const reminder_status = JSON.parse(res.data.body)['reminder_status']

            localStorage.setItem('uid', uid);
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('reminder_status', reminder_status);
            setLogin(true);
        })
            .catch(err => {
                console.log(err)
            });
    }

    return (
        <div>
            <h1 className="mb-3">Keep It Fresh, the fridge organizer you need.</h1>

            {/* Reference: https://www.npmjs.com/package/@react-oauth/google*/}
            <GoogleLogin
                onSuccess={credentialResponse => {
                    const cred = jwt_decode(credentialResponse.credential)
                    const email = cred.email;
                    const name = cred.name;
                    localStorage.setItem('userName', name);
                    localStorage.setItem('userEmail', email);
                    handleLogin(email, name);
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
            />
        </div>
    );
}

export default Login;
