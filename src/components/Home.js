import React, { useContext, useEffect, useState } from "react";
import "../scss/home.scss";
import { Navbar } from "./Navbar";
import { db } from "../firebase";
import { Post } from "./post/Post";
import { Friend } from "./friend/Friend";
import { Message } from "./message/Message";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { Route, Routes } from "react-router-dom";
import { Profile } from "./profile/Profile";
import { useDispatch } from "react-redux";
import { getPostList } from "../store/postListSlice";
import { Footer } from "./Footer";
import { Bookmark } from "./Bookmark";
import { getMessaging, onMessage } from "firebase/messaging";
import { Notifications } from "./notifications/Notifications";

export function Home() {
  const { currentUser } = useContext(AuthContext);
  const [postIsLoading, setPostIsLoading] = useState(true);
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  const dispatch = useDispatch();
  const messaging = getMessaging();
  onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);
    // ...
  });
  useEffect(() => {
    if (currentUser) {
      async function getPost() {
        const posts = await getDocs(q);
        dispatch(
          getPostList(
            posts.docs.map((doc) => ({
              id: doc.id,
              author: doc.data().author,
              imageURL: doc.data().imageURL,
              likes: doc.data().likes,
              content: doc.data().content,
              poll: doc.data().poll,
              timestamp: doc.data().timestamp.seconds,
            }))
          )
        );
        setPostIsLoading(false);
      }
      getPost();
    }
  }, [currentUser.uid]);
  return (
    <main>
      <div className="main-wrapper">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Post postIsLoading={postIsLoading} />
                <Friend />
              </>
            }
          ></Route>
          <Route
            path="/:userId"
            element={
              <>
                <Profile />
                <Friend />
              </>
            }
          ></Route>
          <Route
            path="/bookmarks"
            element={
              <>
                <Bookmark />
                <Friend />
              </>
            }
          ></Route>
          <Route
            path="/notifications"
            element={
              <>
                <Notifications />
                <Friend />
              </>
            }
          ></Route>
          <Route path="/messages" element={<Message />}></Route>
        </Routes>
        <Footer></Footer>
      </div>
    </main>
  );
}
