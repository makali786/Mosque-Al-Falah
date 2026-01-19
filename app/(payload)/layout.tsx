/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config';
import '@payloadcms/next/css';
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts';
import type { ServerFunctionClient } from 'payload';
import React from 'react';

import { Inter } from 'next/font/google';
import '../(frontend)/globals.css';
import { importMap } from './admin/importMap.js';
import BackgroundAnimation from './components/payload/BackgroundAnimation';
import './custom.scss';
type Args = {
  children: React.ReactNode;
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const serverFunction: ServerFunctionClient = async function (args) {
  'use server';
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: Args) => (
  <RootLayout
    config={config}
    importMap={importMap}
    serverFunction={serverFunction}
  >
    <div className={inter.variable}>
      <BackgroundAnimation />
      {children}
    </div>
  </RootLayout>
);

export default Layout;
