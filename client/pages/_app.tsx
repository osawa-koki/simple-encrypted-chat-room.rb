import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import '../styles/styles.scss';
import '../styles/menu.scss';
import '../styles/dialog.scss';
import '../styles/room_editor.scss';

import '../styles/index.scss';
import '../styles/about.scss';

import Head from 'next/head';

import setting from '../setting';
import { DataContext } from '../src/DataContext';
import SharedData from '../src/SharedData';
import { Alert, CloseButton } from 'react-bootstrap';

type DialogStruct = ['primary' | 'info' | 'warning' | 'danger', string] | null;
export type { DialogStruct };

export type AppStruct = {
  // eslint-disable-next-line no-unused-vars
  SetDialog: (dialog: DialogStruct) => Promise<void>;
  SaveInLocalStorage: () => void;
};

function PickItem(array: any[], index: number) {
  if (array === null) return null;
  if (array.length <= index) return null;
  return array[index];
}

export default function MyApp({ Component, pageProps }: AppProps) {

  const [dialog, setDialog] = useState<DialogStruct>(null);

  const [sharedData, setSharedData] = useState<SharedData>({
    username: '',
    current_room: null,
    rooms: [],
    message: '',
  });

  const SetDialog = async (dialog: DialogStruct) => {
    setDialog(dialog);
    await new Promise((resolve) => setTimeout(resolve, setting.dialogWaitingTime));
    setDialog(null);
  };

  const SaveInLocalStorage = () => {
    console.log('Saving data to local storage...');
    localStorage.setItem('username', sharedData.username);
    localStorage.setItem('current_room', JSON.stringify(sharedData.current_room));
    localStorage.setItem('rooms', JSON.stringify(sharedData.rooms));
    localStorage.setItem('message', sharedData.message);
  };

  useEffect(() => {
    console.log('Retrieving data from local storage...');
    const username = localStorage.getItem('username');
    const current_room = localStorage.getItem('current_room');
    const rooms = localStorage.getItem('rooms');
    const key = localStorage.getItem('key');
    const message = localStorage.getItem('message');
    if (username) setSharedData((prev) => ({ ...prev, username }));
    if (current_room) setSharedData((prev) => ({ ...prev, current_room: JSON.parse(current_room) }));
    if (rooms) setSharedData((prev) => ({ ...prev, rooms: JSON.parse(rooms) }));
    if (key) setSharedData((prev) => ({ ...prev, key }));
    if (message) setSharedData((prev) => ({ ...prev, message }));
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{setting.title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" type="image/png" href={`${setting.basePath}/favicon.ico`} />
      </Head>
      <DataContext.Provider value={{sharedData, setSharedData}}>
        <Component {...pageProps} SetDialog={SetDialog} SaveInLocalStorage={SaveInLocalStorage} />
        <Alert id="Dialog" variant={PickItem(dialog, 0)} className={dialog ? 'is-open' : ''}>
          <CloseButton id="Closer" onClick={() => {SetDialog(null)}} />
          <div>{PickItem(dialog, 1)}</div>
        </Alert>
      </DataContext.Provider>
    </>
  );
};
