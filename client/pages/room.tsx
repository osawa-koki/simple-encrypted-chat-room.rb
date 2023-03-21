import React, { useContext, useState } from "react";

import { Button, Alert, Form } from 'react-bootstrap';
import Layout from "../components/Layout";

import { DataContext } from "../src/DataContext";

export default function RoomPage() {

  const { sharedData, setSharedData } = useContext(DataContext);

  return (
    <Layout>
      <div id="Room">
      </div>
    </Layout>
  );
};
