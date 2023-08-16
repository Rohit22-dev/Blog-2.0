"use client";
import "@/styles/globals.css";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import authReducer from "@/states";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
import store from "@/store/store";
import Navbar from "@/components/Navbar";

// const persistConfig = { key: "root", storage, version: 1 };
// const persistedReducer = persistReducer(persistConfig, authReducer);
// const store = configureStore({
//   reducer: persistedReducer,
// });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistStore(store)}> */}
      <html lang="en" suppressHydrationWarning>
        <head />
        <title>Story Sage</title>
        <meta name="description" content="Your meta description here" />
        <body
          className={clsx(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <ToastContainer theme="dark" />
            <div className="relative flex flex-col h-screen">
              <Navbar />
              <main className="container mx-auto max-w-8xl pt-16 px-6 flex-grow">
                {children}
              </main>
              <footer className="w-full flex items-center justify-center py-3">
                <Link
                  isExternal
                  className="flex items-center gap-1 text-current"
                  href="https://rkcodes.vercel.app/"
                  title="Octivion hub"
                >
                  <span className="text-default-600">
                    Developed & desiged by
                  </span>
                  <p className="text-primary">Octivion</p>
                </Link>
              </footer>
            </div>
          </Providers>
        </body>
      </html>
      {/* </PersistGate> */}
    </Provider>
  );
}
