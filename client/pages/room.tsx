import React, { useContext, useState } from "react";

import { Button, Alert, Form, Table } from 'react-bootstrap';
import Layout from "../components/Layout";

import { DataContext } from "../src/DataContext";
import { AppStruct } from "./_app";

export default function RoomPage({ SetDialog }: AppStruct) {

  const { sharedData, setSharedData } = useContext(DataContext);

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
                <Form.Control type="text" value={sharedData.current_room.room_name} readOnly />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" value={sharedData.current_room.description} readOnly />
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
            <Form.Control type="text" placeholder="Enter room name" />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" placeholder="Enter description" />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" />
          </Form.Group>
          <Button variant="primary" className="mt-3 d-block m-auto" onClick={() => {
            SetDialog(['primary', 'Room created.']);
          }}>Create Room</Button>
        </Form>
      </div>
    </Layout>
  );
};
