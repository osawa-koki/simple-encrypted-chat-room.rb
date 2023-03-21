import React from "react";
import { Form, Table, Button, CloseButton } from "react-bootstrap";
import Room from "../src/Room";

export default function RoomEditor({ room, closer }: { room: Room, closer: () => void }) {

  const [room_name, setRoomName] = React.useState(room.room_name);
  const [description, setDescription] = React.useState(room.description);
  const [new_password, setNewPassword] = React.useState('');
  const [confirm_password, setConfirmPassword] = React.useState('');

  return (
    <div id="RoomEditor">
      <h2>🐶 Room Editor</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#1</th>
            <th>#2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Room Name</td>
            <td>
              <Form.Control type="text" value={room_name} onInput={(e) => {setRoomName(e.currentTarget.value)}} />
            </td>
          </tr>
          <tr>
            <td>Description</td>
            <td>
              <Form.Control type="text" value={description} onInput={(e) => {setDescription(e.currentTarget.value)}} />
            </td>
          </tr>
          <tr>
            <td>New Password</td>
            <td>
              <Form.Control type="password" value={new_password} onInput={(e) => {setNewPassword(e.currentTarget.value)}} />
            </td>
          </tr>
          <tr>
            <td>Confirm Password</td>
            <td>
              <Form.Control type="password" value={confirm_password} onInput={(e) => {setConfirmPassword(e.currentTarget.value)}} />
            </td>
          </tr>
        </tbody>
      </Table>
      <Button variant="primary" size="sm" >Update!</Button>
      <CloseButton id="Closer" onClick={() => {closer()}} />
    </div>
  );
};
