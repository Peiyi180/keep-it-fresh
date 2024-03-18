import {Form} from 'react-bootstrap';
import React, {useEffect} from 'react';
import {HOST} from "../constants";
import axios from "axios";

function Reminder(props) {
    const {reminderStatus, setReminderStatus} = props;

    useEffect(() => {
        const reminder_status = localStorage.getItem('reminder_status');
        if (reminder_status) {
            setReminderStatus(reminder_status === 'true');
        }
    });

    function toggleReminder() {
        const newStatus = !reminderStatus;

        axios.post(`${HOST}/reminder`, {
            email: localStorage.getItem('userEmail'),
            uid: localStorage.getItem('uid'),
            reminder_status: newStatus.toString()
        }).then(res => {
            localStorage.setItem('reminder_status', newStatus.toString());
            setReminderStatus(newStatus);
            console.log('status updated: ' + newStatus)
        })
            .catch(err => {
                console.log(err)
            });
    }

    return (
        // Reference: https://react-bootstrap.netlify.app/forms/overview/#rb-docs-content
        <Form>
            <Form.Check
                type="switch"
                id="email-reminder-switch"
                label={reminderStatus ? 'Email Reminder On' : 'Email Reminder Off'}
                checked={reminderStatus}
                onChange={toggleReminder}
            />
        </Form>
    )
}

export default Reminder