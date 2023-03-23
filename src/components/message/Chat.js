import styled from "@emotion/styled";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/MessageContext";
import { db } from "../../firebase";

export const Chat = ({ chat }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  useEffect(() => {
    if (chat) {
      const readMessage = async () => {
        const q = query(
          collection(db, "chats", data.chatId, "messages"),
          where("read", "==", false),
          where("author", "!=", currentUser.uid)
        );
        const res = await getDocs(q);
        res.forEach((message) => {
          updateDoc(message.ref, { read: true });
        });
      };
      readMessage();
    }
  }, [chat]);
  const Wrapper = styled.div`
    margin: 10px;
  `;

  const OuterRight = styled.div`
    width: 100%;
    text-align: right;
  `;
  const OuterLeft = styled.div`
    width: 100%;
    text-align: left;
  `;
  const Photo = styled.div`
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-image: url(${chat.data.photoURL
      ? chat.data.photoURL
      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  `;
  const Message = styled.div`
    display: inline-block;
    border-radius: ${chat.data.author == currentUser.uid
      ? "20px 0 20px 20px"
      : "0 20px 20px 20px"};
    max-width: 400px;
    height: auto;
    width: auto;
    background-color: #fff;
    padding: 5px 20px;
    vertical-align: text-top;
    word-wrap: break-word;
    text-align: initial;
    font-size: 18px;
    ${chat.data.author == currentUser.uid
      ? "margin-right"
      : "margin-left"}: 12px;
    @media (max-width: 1020px) {
      max-width: 350px;
    }
    @media (max-width: 740px) {
      max-width: 250px;
    }
    @media (max-width: 500px) {
      max-width: 230px;
    }
  `;
  const Container = styled.div`
    display: inline-block;
    vertical-align: middle;
  `;
  const ReadState = styled.span`
    font-size: 16px;
    color: #777;
    display: inline-block;
    margin: 0 6px;
  `;
  const Time = styled.span`
    font-size: 14px;
    color: #777;
    display: block;
    margin: 0 6px;
  `;
  const getTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const secondsAgo = Math.floor((now - date) / 1000);
    if (secondsAgo < 60) {
      return "Just now";
    } else if (secondsAgo < 60 * 60) {
      const minutesAgo = Math.floor(secondsAgo / 60);
      return `${minutesAgo}minutes ago`;
    } else if (secondsAgo < 60 * 60 * 24) {
      const hoursAgo = Math.floor(secondsAgo / (60 * 60));
      return `${hoursAgo}hours ago`;
    } else {
      return date.toLocaleString("en-US", {
        hour12: false,
        minute: "2-digit",
        hour: "2-digit",
        day: "numeric",
        month: "short",
      });
    }
  };

  return (
    <Wrapper>
      {chat.data.author == currentUser.uid ? (
        <OuterRight>
          <Container>
            {chat.data.author == currentUser.uid && (
              <ReadState>{chat.data.read ? "read" : "unread"}</ReadState>
            )}
            <Time>{getTime(chat.data.date.seconds * 1000)}</Time>
          </Container>
          <Message>{chat.data.message}</Message>
          <Photo></Photo>
        </OuterRight>
      ) : (
        <OuterLeft>
          <Photo></Photo>
          <Message>{chat.data.message}</Message>
          <Container>
            {chat.data.author == currentUser.uid && (
              <ReadState>{chat.data.read ? "read" : "unread"}</ReadState>
            )}
            <Time>{getTime(chat.data.date.seconds * 1000)}</Time>
          </Container>
        </OuterLeft>
      )}
    </Wrapper>
  );
};
