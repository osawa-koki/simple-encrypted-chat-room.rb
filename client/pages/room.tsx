import React, { useContext, useEffect, useState } from "react";

import { Button, Alert, Form, Table } from 'react-bootstrap';
import Layout from "../components/Layout";
import RoomEditor from "../components/RoomEditor";
import setting from "../setting";

import { DataContext } from "../src/DataContext";
import Room from "../src/Room";
import { AppStruct } from "./_app";

const room_name_regex = /^[a-zA-Z0-9-_]{3,16}$/;

export default function RoomPage({ SetDialog, SaveInLocalStorage }: AppStruct) {

  const { sharedData, setSharedData } = useContext(DataContext);

  const [room_name, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const HasErrorCreating: () => string | null = () => {
    if (room_name === '') return 'Room name is required.';
    if (!room_name.match(room_name_regex)) return "Room name must be alphanumeric and contain only '-', '_'.";
    if (description === '') return 'Description is required.';
    if (password === '') return 'Password is required.';
    return null;
  };

  const [join_room_name, setJoinRoomName] = useState('');
  const HasErrorJoining: () => string | null = () => {
    if (join_room_name === '') return 'Room name is required.';
    if (!join_room_name.match(room_name_regex)) return "Room name must be alphanumeric and contain only '-', '_'.";
    return null;
  };

  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const RoomUpdated = (id: number, room: Room) => {
    const new_data = {
      ...sharedData,
      rooms: sharedData.rooms.map((_room) => {
        if (_room.id === id) return room;
        return _room;
      }),
    };
    if (sharedData.current_room && sharedData.current_room.id === id) {
      new_data.current_room = room;
    }
    setSharedData(new_data);
    setSaver(saver + 1);
  };

  const [loading, setLoading] = useState(false);

  const [saver, setSaver] = useState(0);

  useEffect(() => {
    if (saver === 0) return;
    SaveInLocalStorage();
  }, [SaveInLocalStorage, saver]);

  return (
    <Layout>
      <div id="Room">
        <h1>🏡 Room</h1>
        <hr />
        <h2>Current Room</h2>
        {
          sharedData.current_room ? (
            <Form className="mt-3">
              <Form.Group className="mt-3">
                <Form.Label>Room Name</Form.Label>
                <Form.Control type="text" value={sharedData.current_room.room_name} disabled />
              </Form.Group>
              <Form.Group className="mt-3">
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
                      <td>
                        <span role="button" className="text-primary underline" onClick={() => {
                          setEditingRoom(room);
                          setShowEditor(true);
                        }}>{room.room_name}</span>
                      </td>
                      <td>{room.description}</td>
                      <td>
                          {
                            (sharedData.current_room !== null && sharedData.current_room.id === room.id) ? (
                              <div>🌠 Current 🌠</div>
                            ) : (
                              <Button variant="info" size="sm" onClick={() => {
                                setSharedData({
                                  ...sharedData,
                                  current_room: room,
                                })
                                setSaver(saver + 1);
                              }}>Join</Button>
                            )
                          }
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
            HasErrorCreating() !== null ? (
              <Alert variant="danger" className="mt-3">
                {HasErrorCreating()}
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
            if (res.status === 409) {
              SetDialog(['danger', 'Room name is already taken.']);
              setLoading(false);
              return;
            }
            if (res.ok === false) {
              SetDialog(['danger', 'Failed to create room. (unknown error)']);
              setLoading(false);
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
            setSaver(saver + 1);
            setLoading(false);
          }} disabled={loading || HasErrorCreating() !== null}>Create Room</Button>
        </Form>
        <hr />
        <h2>Join Room</h2>
        <Form className="mt-3">
          <Form.Group className="mt-3">
            <Form.Label>Room Name</Form.Label>
            <Form.Control type="text" placeholder="Enter room name" value={join_room_name} onInput={(e) => {setJoinRoomName(e.currentTarget.value)}} />
          </Form.Group>
          {
            sharedData.rooms.find(a => a.room_name === join_room_name) !== undefined ? (
              <Alert variant="danger" className="mt-3">
                You are already in this room.
              </Alert>
            ) : HasErrorJoining() !== null ? (
              <Alert variant="danger" className="mt-3">
                {HasErrorJoining()}
              </Alert>
            ) : <></>
          }
          <Button variant="primary" className="mt-3 d-block m-auto" onClick={async () => {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, setting.smallWaitingTime));
            const res = await fetch(`${setting.apiPath}/api/rooms/${join_room_name}`, {
              method: 'GET',
            });
            if (res.status === 404) {
              SetDialog(['danger', 'Room not found.']);
              setLoading(false);
              return;
            }
            if (res.ok === false) {
              SetDialog(['danger', 'Failed to join room.']);
              setLoading(false);
              return;
            }
            const room = await res.json() as Room;
            setSharedData({
              ...sharedData,
              current_room: room,
              rooms: [
                ...sharedData.rooms,
                room,
              ],
            });
            SetDialog(['info', 'Room joined successfully.']);
            setJoinRoomName('');
            setSaver(saver + 1);
            setLoading(false);
          }} disabled={loading || HasErrorJoining() !== null || sharedData.rooms.find(a => a.room_name === join_room_name) !== undefined}>Join Room</Button>
        </Form>
      </div>
      {
        showEditor && <RoomEditor room={editingRoom} closer={() => {setShowEditor(false)}} SetDialog={SetDialog} RoomUpdated={RoomUpdated} />
      }
    </Layout>
  );
};
