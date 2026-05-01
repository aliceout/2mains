/* eslint-disable react/jsx-pascal-case */
// Layout racine pour toutes les routes Payload (admin + API).
// Ce fichier est importé par le runtime Next.js de Payload — on
// délègue au RootLayout de @payloadcms/next.
import config from '@payload-config';
import { RootLayout } from '@payloadcms/next/layouts';
import { handleServerFunctions } from '@payloadcms/next/utilities';
import type { ServerFunctionClient } from 'payload';
import React from 'react';

import './custom.scss';
import { importMap } from './admin/importMap.js';

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  'use server';
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;
