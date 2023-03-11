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
import * as Icon from "../icon/icon";

export const Input = () => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [img, setImg] = useState(null);
  const ref = useRef();
  const handleSend = async () => {
    const textMessage = ref.current.value;
    try {
      await addDoc(collection(db, "chats", data.chatId, "messages"), {
        author: currentUser.uid,
        photoURL: currentUser.photoURL,
        message: textMessage,
        img: img,
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

  const InputWrapper = styled.div`
    position: absolute;
    width: 500px;
    left: 15px;
    bottom: 15px;
    border-radius: 12px;
    border: 1px solid #666;
    background-color: #e8ccac;
    @media (max-width: 1020px) {
      width: 95%;
    }
    @media (max-width: 500px) {
      bottom: 5%;
      @media (max-height: 900px) {
        bottom: 7%;
      }
    }
  `;
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
  const IconWrapper = styled.div`
    position: relative;
    display: inline-block;
    width: 36px;
    height: 36px;
    left: 10px;
    border-radius: 50%;
    vertical-align: bottom;
    cursor: pointer;
    svg {
      transform: translateY(4px);
    }
    &:hover {
      background-color: #999;
    }
  `;
  const ImageWrapper = styled.div`
    width: 100px;
    height: 60px;
    background-color: #ddd;
    border-radius: 12px;
  `;
  return (
    <div className="message-input-wrapper">
      {/* <IconWrapper>
        <Icon.postImageIcon></Icon.postImageIcon>
      </IconWrapper> */}
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
      <input type={"file"} style={{ display: "none" }}></input>
    </div>
  );
};
