import React, { useContext, useState } from "react";

import { Button, Alert, Form, Table } from 'react-bootstrap';
import Layout from "../components/Layout";
import setting from "../setting";

import { DataContext } from "../src/DataContext";
import Room from "../src/Room";
import { AppStruct } from "./_app";

export default function RoomPage({ SetDialog }: AppStruct) {

  const { sharedData, setSharedData } = useContext(DataContext);

  const [room_name, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const HasErrorAboutRoom: () => string | null = () => {
    if (room_name === '') return 'Room name is required.';
    if (!room_name.match(/^[a-zA-Z0-9-_]{3,16}$/)) return "Room name must be alphanumeric and contain only '-', '_'.";
    if (description === '') return 'Description is required.';
    if (password === '') return 'Password is required.';
    return null;
  };

  const [loading, setLoading] = useState(false);

  return (
    <Layout>
      <div id="Room">
        <h1>🏡 Room</h1>
        <hr />
        <h2>Current Room</h2>
        {
          sharedData.current_room ? (
            <Form className="mt-3">
              <Form.Group>
                <Form.Label>Room Name</Form.Label>
                <Form.Control type="text" value={sharedData.current_room.room_name} disabled />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" value={sharedData.current_room.description} disabled />
              </Form.Group>
            </Form>
          ) : (
            <Alert variant="warning" className="mt-3">
              You are not in any room.
            </Alert>
          )
        }
        <hr />
        <h2>Room List</h2>
        {
          sharedData.rooms.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Room Name</th>
                  <th>Description</th>
                  <th>Join</th>
                </tr>
              </thead>
              <tbody>
                {
                  sharedData.rooms.map((room, index) => (
                    <tr key={index}>
                      <td>{room.room_name}</td>
                      <td>{room.description}</td>
                      <td>
                        <Button variant="primary" onClick={() => {
                          setSharedData({
                            ...sharedData,
                            current_room: room,
                          });
                        }}>Join</Button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          ) : (
            <Alert variant="warning" className="mt-3">
              There is no room.
            </Alert>
          )
        }
        <hr />
        <h2>Create Room</h2>
        <Form className="mt-3">
          <Form.Group className="mt-3">
            <Form.Label>Room Name</Form.Label>
            <Form.Control type="text" placeholder="Enter room name" value={room_name} onInput={(e) => {setRoomName(e.currentTarget.value)}} />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" placeholder="Enter description" value={description} onInput={(e) => {setDescription(e.currentTarget.value)}} />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" value={password} onInput={(e) => {setPassword(e.currentTarget.value)}} />
          </Form.Group>
          {
            HasErrorAboutRoom() !== null ? (
              <Alert variant="danger" className="mt-3">
                {HasErrorAboutRoom()}
              </Alert>
            ) : <></>
          }
          <Button variant="primary" className="mt-3 d-block m-auto" onClick={async () => {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, setting.smallWaitingTime));
            const res = await fetch(`${setting.apiPath}/api/rooms`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                room_name: room_name,
                description: description,
                password: password,
              }),
            });
            if (res.ok === false) {
              setError("Failed to create room.");
              return;
            }
            const room = await res.json() as Room;
            setSharedData({
              ...sharedData,
              rooms: [
                ...sharedData.rooms,
                room,
              ],
            });
            SetDialog(['info', 'Room created successfully.']);
            setLoading(false);
          }} disabled={loading || HasErrorAboutRoom() !== null}>Create Room</Button>
        </Form>
      </div>
    </Layout>
  );
};
