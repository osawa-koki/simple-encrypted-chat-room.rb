import React, { useContext, useState } from "react";

import { Button, Alert, Form } from 'react-bootstrap';
import Layout from "../components/Layout";

import { DataContext } from "../src/DataContext";

export default function RoomPage() {

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
      </div>
    </Layout>
  );
};
