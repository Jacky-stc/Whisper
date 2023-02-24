import React, { useContext, useEffect, useState } from "react";
import "../scss/home.scss";
import { Navbar } from "./Navbar";
import { db, storage } from "../firebase";
import { Post } from "./post/Post";
import { Friend } from "./friend/Friend";
import { Message } from "./message/Message";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { Route, Routes } from "react-router-dom";
import { Profile } from "./profile/Profile";
import { useSelector, useDispatch } from "react-redux";
import { getPostList } from "../store/postListSlice";
import styled from "@emotion/styled";

export function Home() {
  const { currentUser } = useContext(AuthContext);
  const [postIsLoading, setPostIsLoading] = useState(true);
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  const postList = useSelector((state) => state.postList.postList);
  const dispatch = useDispatch();
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
  const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
  `;
  return (
    <main>
      <Wrapper>
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
          <Route path="/messages/*" element={<Message />}></Route>
        </Routes>
      </Wrapper>
    </main>
  );
}
