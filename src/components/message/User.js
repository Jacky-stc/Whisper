import styled from "@emotion/styled";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/MessageContext";
import { db } from "../../firebase";

export const User = ({ user }) => {
  const [unread, setUnread] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  console.log(data);
  useEffect(() => {
    let unreadList = [];
    const q = query(
      collection(db, "chats", user[0], "messages"),
      where("author", "!=", currentUser.uid)
    );
    onSnapshot(q, { includeMetadataChanges: true }, (querysnapshot) => {
      querysnapshot.forEach((message) => {
        if (!message.metadata.hasPendingWrites) {
          if (message.data().read !== undefined && !message.data().read) {
            unreadList.push(message.data());
          }
        }
      });
      if (unreadList.length == 0) {
        setUnread(null);
      } else {
        setUnread(unreadList.length);
      }
    });
  }, [user]);
  const { dispatch } = useContext(ChatContext);
  const Photo = styled.div`
    display: inline-block;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    background-color: #fff;
    background-image: url(${user[1].userInfo.photoURL
      ? user[1].userInfo.photoURL
      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  `;
  const Info = styled.div`
    display: inline-block;
    position: relative;
    width: 75%;
    height: 50px;
    margin-left: 10px;
    vertical-align: top;
  `;
  const Name = styled.div`
    width: 100%;
    font-size: 18px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  `;
  const Email = styled.div`
    color: #777;
    width: 100%;
    font-size: 18px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  `;
  const Hint = styled.div`
    width: 16px;
    height: 16px;
    border-radius: 50%;
    color: #fff;
    background-color: red;
    position: absolute;
    display: inline-block;
    top: 30px;
    font-size: 12px;
    text-align: center;
  `;
  const handleSelect = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };
  const readMessage = async () => {
    setUnread(null);
    const q = query(
      collection(db, "chats", user[0], "messages"),
      where("read", "==", false),
      where("author", "!=", currentUser.uid)
    );
    const res = await getDocs(q);
    res.forEach((message) => {
      updateDoc(message.ref, { read: true });
    });
  };
  return (
    <div
      className="user-wrapper"
      onClick={() => {
        document.querySelector(".message").classList.add("show");
        document.querySelector(".user-container").classList.add("hide");
        handleSelect(user[1].userInfo);
        readMessage();
      }}
    >
      <Photo></Photo>
      <Info>
        <Name>{user[1].userInfo.displayName}</Name>
        <Email>{user[1].lastMessage.text}</Email>
      </Info>
      {unread && <Hint>{unread}</Hint>}
    </div>
  );
};
