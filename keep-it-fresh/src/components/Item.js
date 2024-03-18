import {Button} from "react-bootstrap";
import './Item.css'
import axios from "axios";
import {HOST} from "../constants";

function Item(props) {
    const {data, items, setItems} = props;

    function handleDelete(item_uid) {
        const user_uid = localStorage.getItem('uid')

        axios.post(`${HOST}/remove`, {
            user_uid: user_uid,
            item_uid: item_uid
        }).then(res => {
            console.log('deleted iterm success');
            const newItems = items.filter(item => item.uid !== item_uid);
            setItems(newItems)

        })
            .catch(err => {
                console.log(err)
            });
    }

    return (
        <>
            <td>{data.name}</td>
            <td>{data.expire_date}</td>
            <td><Button variant="outline-danger" onClick={(e) => {
                handleDelete(data.uid)
            }}
            >Remove</Button></td>
        </>
    );
}

export default Item;