import axios from 'axios';
import React, {useState, useEffect} from 'react';
import Refrigerator from "./Refrigerator";
import './Dashboard.css'
import {Modal, Button, Form, Alert} from 'react-bootstrap';
import {HOST} from "../constants";
import Reminder from "./Reminder";

function Dashboard(props) {
    const {setLogin} = props

    const [items, setItems] = useState([]);
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [days, setDays] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [userName, setUserName] = useState('');
    const [welcome, setWelcome] = useState('');
    const [reminderStatus, setReminderStatus] = useState(false);

    const handleLogout = async () => {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('uid');
        localStorage.removeItem('userName');
        localStorage.removeItem('reminder_status');
        localStorage.removeItem('userEmail');

        setLogin(false);
    };
    const handleAdd = (e) => {
        e.preventDefault();
        const loggedIn = localStorage.getItem('loggedIn');
        const uid = localStorage.getItem('uid');

        axios.post(`${HOST}/add`, {
            uid: uid,
            name: name,
            days: days
        }).then(res => {

            const item_uid = JSON.parse(res.data.body)['uid'];
            const expire_date = JSON.parse(res.data.body)['expire_date'];
            const new_item = {
                uid: item_uid,
                name: name,
                expire_date: expire_date
            }
            setItems((prev) => [...prev, new_item]);
            setShow(false);
        }).catch(err => {
            console.log(err);
            return Promise.reject(err);
        });
    };


    useEffect(() => {
        axios.post(`${HOST}/refrigerator`, {
            uid: localStorage.getItem('uid')
        })
            .then(res => {
                const items = res.data.body
                setItems(items ? items : [])
            })

        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) {
            setWelcome('Good Morning');
        } else if (hour >= 12 && hour < 18) {
            setWelcome('Good Afternoon');
        } else {
            setWelcome('Good Evening');
        }

        setUserName(localStorage.getItem('userName'));
    }, []);


    const handleClose = () => {
        setShow(false);
        setErrorMessage(null);
    };

    return (
        <div>
            <header className="App-header">
                <title>Keep It Fresh!</title>
            </header>
            <main className="main">


                <h1>{welcome}! {userName}</h1>

                <div className="reminder">
                    <Reminder reminderStatus={reminderStatus} setReminderStatus={setReminderStatus}></Reminder>

                </div>

                <div className="control">
                    <Button variant="primary" onClick={() => setShow(true)}>
                        Add Item
                    </Button>
                    <Button className="ms-3" variant="danger" onClick={handleLogout}>Logout</Button>
                </div>

                {items && items.length !== 0 ?
                    <Refrigerator items={items} setItems={setItems}></Refrigerator> :
                    <p className="prompt-msg">Your fridge is empty. Click "Add Item" to add item to it!</p>

                }

                {/* Pop up window reference: https://react-bootstrap.github.io/components/modal/*/}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleAdd}>
                            <Form.Group controlId="item-name">
                                <Form.Label>Name:</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="item-days">
                                <Form.Label>Days:</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={days}
                                    onChange={(event) => setDays(parseInt(event.target.value))}
                                    min={1}
                                    required
                                />
                            </Form.Group>
                            {errorMessage ? <Alert variant="danger">{errorMessage}</Alert> : null}
                            <Button className="me-2 mt-2" variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button className="mt-2" variant="primary" type="submit">
                                Add
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>


            </main>
        </div>
    );
}

export default Dashboard;