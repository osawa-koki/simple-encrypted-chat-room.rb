import React from "react";
import { Form, Table, Button, CloseButton } from "react-bootstrap";
import setting from "../setting";
import Room from "../src/Room";

const masked_password = "**********";

export default function RoomEditor({ room, closer, SetDialog, RoomUpdated }: { room: Room, closer: () => void, SetDialog: any, RoomUpdated: any }) {

  const [room_name, setRoomName] = React.useState(room.room_name);
  const [description, setDescription] = React.useState(room.description);
  const [new_password, setNewPassword] = React.useState(masked_password);
  const [confirm_password, setConfirmPassword] = React.useState('');

  const Update = async () => {
    if (room.id === undefined) {
      SetDialog(['danger', 'Room is not found. Try again...']);
      closer();
      return;
    }
    const new_data = {};
    if (room_name !== room.room_name) new_data['room_name'] = room_name;
    if (description !== room.description) new_data['description'] = description;
    if (new_password !== masked_password) new_data['new_password'] = new_password;
    if (confirm_password !== '') new_data['confirm_password'] = confirm_password;
    const res = await fetch(`${setting.apiPath}/api/rooms/${room.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(new_data),
    });
    if (res.status === 409) {
      SetDialog(['danger', 'Room name is already taken.']);
      return;
    }
    if (res.status === 403) {
      SetDialog(['danger', 'Password is incorrect.']);
      return;
    }
    if (res.ok === false) {
      SetDialog(['danger', 'Failed to update room. (unknown error)']);
      return;
    }
    RoomUpdated(room.id, {
      id: room.id,
      room_name: room_name,
      description: description,
      password: "**********",
    })
    SetDialog(['success', 'Room updated!']);
  };

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
            <td>Room Id</td>
            <td>
              <Form.Control type="text" value={room.id} disabled />
            </td>
          </tr>
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
      <Button variant="primary" size="sm" onClick={Update}>Update!</Button>
      <CloseButton id="Closer" onClick={() => {closer()}} />
    </div>
  );
};
