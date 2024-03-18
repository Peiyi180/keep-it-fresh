import Item from "./Item";
import {Table} from 'react-bootstrap';

function Refrigerator(props) {
    const {items, setItems} = props;

    return (
        <div className="mt-5">
            <Table striped bordered hover className="mt-4">
                <thead>
                <tr>
                    <th>Item</th>
                    <th>Expiration Date</th>
                    <th>Remove</th>
                </tr>
                </thead>
                <tbody>
                {items && items.length !== 0 ? items
                    .sort((a, b) => (a.expire_date > b.expire_date) ? 1 : -1)
                    .map(item => (
                        <tr key={item.uid}>
                            <Item key={item.uid} data={item} items={items}
                                  setItems={setItems}></Item>
                        </tr>
                    )) : null}
                </tbody>
            </Table>

        </div>
    )
}

export default Refrigerator;