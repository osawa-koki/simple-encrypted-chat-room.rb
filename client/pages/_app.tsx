import React from 'react';
import { AppProps } from 'next/app';
import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import '../styles/styles.scss';
import '../styles/menu.scss';
import '../styles/dialog.scss';

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
  SetDialog: (dialog: DialogStruct) => Promise<void>
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
    key: '',
    message: '',
  });

  const SetDialog = async (dialog: DialogStruct) => {
    setDialog(dialog);
    await new Promise((resolve) => setTimeout(resolve, setting.dialogWaitingTime));
    setDialog(null);
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{setting.title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" type="image/png" href={`${setting.basePath}/favicon.ico`} />
      </Head>
      <DataContext.Provider value={{sharedData, setSharedData}}>
        <Component {...pageProps} SetDialog={SetDialog} />
        <Alert id="Dialog" variant={PickItem(dialog, 0)} className={dialog ? 'is-open' : ''}>
          <CloseButton id="Closer" onClick={() => {SetDialog(null)}} />
          <div>{PickItem(dialog, 1)}</div>
        </Alert>
      </DataContext.Provider>
    </>
  );
};
