import React, { useEffect, useState } from "react";

import { Button, Alert, Form, Spinner, Table } from 'react-bootstrap';
import Layout from "../components/Layout";
import setting from "../setting";

import { DataContext } from "../src/DataContext";
import Message from "../src/Message";
import { decrypt, encrypt } from "../src/RC4";

const keys = [
  'Ruby',
  'TypeScript',
  'JavaScript',
  'Python',
  'C++',
  'C#',
  'Java',
  'Go',
  'Rust',
  'Kotlin',
  'Swift',
  'PHP',
  'C',
  'Objective-C',
  'Perl',
  'Scala',
  'Haskell',
  'Clojure',
  'Elixir',
  'Erlang',
  'F#',
  'Dart',
  'Lua',
  'Groovy',
  'R',
  'Julia',
  'Matlab',
  'Visual Basic',
  'Delphi',
  'COBOL',
  'Ada',
  'Fortran',
  'Lisp',
  'Prolog',
  'Scheme',
  'Smalltalk',
  'Pascal',
];

export default function ChatPage() {

  const { sharedData, setSharedData } = React.useContext(DataContext);

  const [message, setMessage] = useState<string>('Hello World!!!');
  const [key, setKey] = useState<string>(keys[Math.floor(Math.random() * keys.length)]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<WebSocket>();
  const [ready, setReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('ChatPage mounted');
    const socket = new WebSocket(setting.wsPath === null ?
      (() => {
        // 本番環境
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const path = window.location.pathname;
        if (host && path) {
          return `${protocol}//${host}/cable`;
        }
      })()
      :
      // 開発環境
      `${setting.wsPath}/cable`
    );
    socket.onopen = () => {
      setReady(true);
      const room_id = sharedData.current_room?.id;
      if (room_id === null) {
        setError('Room not found.');
        return;
      }
      console.log('Socket connected');
      socket.send(JSON.stringify({
        command: 'subscribe',
        identifier: JSON.stringify({ channel: 'ChatChannel', room: room_id }),
      }));
      setSocket(socket);
      (async () => {
        const res = await fetch(`${setting.apiPath}/api/chats?room_id=${room_id}`);
        const messages = await res.json() as Message[];
        setMessages(messages);
      })();
    };
  }, [sharedData.current_room]);

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'ping':
          // socket.send(JSON.stringify({
          //   type: 'pong',
          //   message: "pong!!!",
          // }));
          break;
        case 'confirm_subscription':
          // console.log('Subscribed to channel');
          break;
        case 'welcome':
          // console.log('Welcome message');
          break;
        default:
          if (data.message) {
            setMessages([data.message.message, ...messages]);
          }
          break;
      }
    };
    socket.onclose = (event) => {
      console.log('Socket closed connection: ', event);
    };
    socket.onerror = () => {
      setReady(true);
      setError('Socket encountered an error.');
    };
  }, [messages, sharedData, socket]);

  const Send = () => {
    if (socket) {
      const current_room = sharedData.current_room;
      if (current_room === null) {
        setError('Room not found.');
        return;
      }
      socket.send(JSON.stringify({
        command: 'message',
        identifier: JSON.stringify({
          channel: 'ChatChannel',
          room: current_room.id,
        }),
        data: JSON.stringify({
          message: {
            username: sharedData.username,
            message: encrypt(message, key),
          },
        }),
      }));
    }
  };

  return (
    <Layout>
      <div id="Chat">
        <Form>
          <Form.Group className="mt-3 d-flex justify-content-around">
            <Form.Group className="w-50">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter username" value={sharedData.username} onInput={(e) => {
                setSharedData({
                  ...sharedData,
                  username: e.currentTarget.value,
                });
              }} />
            </Form.Group>
            <Form.Group className="w-50">
              <Form.Label>Key</Form.Label>
              <Form.Control type="text" placeholder="Enter key" value={key} onInput={(e) => {setKey(e.currentTarget.value)}} />
            </Form.Group>
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Message</Form.Label>
            <Form.Control as="textarea" rows={5} value={message} onInput={(e) => {setMessage(e.currentTarget.value)}}/>
          </Form.Group>
          <Button variant="primary" className="mt-3 d-block m-auto" onClick={Send} disabled={ready === false || error !== null}>Send 📨</Button>
        </Form>
        {
          error && <Alert variant="danger" className="mt-3">{error}</Alert>
        }
        {
          ready === false && (
            <div className="d-flex justify-content-around mt-3">
              <Spinner animation="border" variant="primary" />
              <Spinner animation="border" variant="secondary" />
              <Spinner animation="border" variant="success" />
              <Spinner animation="border" variant="danger" />
              <Spinner animation="border" variant="warning" />
              <Spinner animation="border" variant="info" />
              <Spinner animation="border" variant="light" />
              <Spinner animation="border" variant="dark" />
            </div>
          )
        }
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th className="w-25">Username</th>
              <th className="w-75">Message</th>
            </tr>
          </thead>
          <tbody>
            {
              messages.map((message, index) => (
                <tr key={index}>
                  <td>{message.username}</td>
                  <td>{decrypt(message.message, key)}</td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </div>
    </Layout>
  );
};
