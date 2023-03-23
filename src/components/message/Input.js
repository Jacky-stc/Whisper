import styled from "@emotion/styled";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/MessageContext";
import { db } from "../../firebase";

export const Input = () => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();
  const handleSend = async () => {
    const textMessage = ref.current.value;
    try {
      await addDoc(collection(db, "chats", data.chatId, "messages"), {
        author: currentUser.uid,
        photoURL: currentUser.photoURL,
        message: textMessage,
        date: serverTimestamp(),
        read: false,
      });
      const res = await getDoc(doc(db, "userChats", data.user.uid));
      res.data() == undefined ||
      (res.data() !== undefined &&
        Object.keys(res.data()).find((element) => element == data.chatId) ==
          undefined)
        ? await setDoc(
            doc(db, "userChats", data.user.uid),
            {
              [data.chatId]: {
                date: serverTimestamp(),
                lastMessage: {
                  text: textMessage,
                },
                userInfo: {
                  displayName: currentUser.displayName,
                  photoURL: currentUser.photoURL,
                  uid: currentUser.uid,
                },
              },
            },
            { merge: true }
          )
        : await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".date"]: serverTimestamp(),
            [data.chatId + ".lastMessage.text"]: textMessage,
          });
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".date"]: serverTimestamp(),
        [data.chatId + ".lastMessage.text"]: textMessage,
      });
    } catch (error) {
      console.error(error);
    }
  };
  const Input = styled.input`
    box-sizing: border-box;
    padding: 20px;
    width: 85%;
    height: 40px;
    background: none;
    border: none;
    &:focus {
      outline: none;
    }
    @media (max-width: 740px) {
      width: 80%;
    }
    @media (max-width: 500px) {
      width: 76%;
    }
  `;
  const Send = styled.button`
    background-color: #eee;
    border: none;
    border-radius: 40px;
    padding: 5px 15px;
    cursor: pointer;
    &:hover {
      filter: brightness(0.8);
    }
  `;
  return (
    <div className="message-input-wrapper">
      <Input
        placeholder="Start a new message"
        ref={ref}
        onKeyDown={(e) => {
          if (e.code == "Enter") {
            handleSend();
          }
        }}
      ></Input>
      <Send onClick={handleSend}>Send</Send>
    </div>
  );
};
