import styled from "@emotion/styled";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase";
import { Chat } from "./Chat";
import { User } from "./User";
import { ChatContext } from "../../context/MessageContext";
import { Input } from "./Input";
import "../../scss/message.scss";

export function Message() {
  const [chatUserList, setChatUserList] = useState();
  const [chatContent, setChatContent] = useState("");
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const chatRef = useRef();
  useEffect(() => {
    const getChatUserList = async () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        if (doc.metadata.hasPendingWrites) {
          return;
        } else {
          setChatUserList(doc.data());
        }
      });
      return () => {
        unsub();
      };
    };
    getChatUserList();
  }, []);
  useEffect(() => {
    const q = query(
      collection(db, "chats", data.chatId, "messages"),
      orderBy("date", "asc")
    );
    const getChat = async () => {
      const unsub = onSnapshot(q, (snapshot) => {
        if (!snapshot.metadata.hasPendingWrites) {
          const chatlist = [];
          snapshot.empty == true
            ? setChatContent(null)
            : snapshot.forEach((doc) => {
                const data = { id: doc.id, data: doc.data() };
                chatlist.push(data);
              });
          setChatContent(chatlist);
        }
      });
      return () => {
        unsub();
      };
    };
    getChat();
  }, [data.chatId]);
  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatContent]);
  const Title = styled.div`
    width: 100%;
    height: 60px;
    font-size: 24px;
    padding: 15px;
    box-sizing: border-box;
    margin-bottom: 10px;
  `;
  const SearchBar = styled.input`
    background: none;
    width: 100%;
    box-sizing: border-box;
    border-radius: 50px;
    padding: 10px;
    text-align: center;
    border: 1px solid #444;
    margin-bottom: 15px;
  `;

  const ChatTitle = styled.div`
    width: 100%;
    height: 80px;
    box-sizing: border-box;
    padding: 30px;
    border-bottom: 1px solid #666;
    font-size: 24px;
    @media (max-width: 500px), (max-height: 900px) {
      height: 8%;
      padding: 4%;
    }
  `;
  const ChatBottom = styled.div`
    position: relative;
    height: 0px;
    bottom: 0;
  `;
  const MessageHint = styled.div`
    position: absolute;
    top: 45%;
    left: 50%;
    margin: 0 auto;
    width: 80%;
    transform: translate(-50%, -50%);
    text-align: start;
    div {
      color: #555;
    }
  `;
  const Back = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: none;
    justify-content: center;
    align-items: center;
    margin-left: -15px;
    cursor: pointer;
    &:hover {
      background-color: #ddd;
    }
    &:active {
      background-color: #aaa;
    }
    @media (max-width: 1020px) {
      display: inline-flex;
    }
  `;
  return (
    <div className="message-wrapper">
      <div className="user-container">
        <Title>Messages</Title>
        <SearchBar placeholder="Search Direct Message"></SearchBar>
        {chatUserList &&
          Object.entries(chatUserList)
            .sort((a, b) => b[1].date - a[1].date)
            .map((user) => <User key={user[0]} user={user} />)}
      </div>
      <div className="message">
        {data.user.displayName && (
          <ChatTitle>
            <Back
              onClick={() => {
                document
                  .querySelector(".user-container")
                  .classList.remove("hide");
                document.querySelector(".message").classList.remove("show");
              }}
            >
              <svg viewBox="-2 -5 30 30">
                <g>
                  <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                </g>
              </svg>
            </Back>
            {data.user.displayName}
          </ChatTitle>
        )}
        {!data.user.displayName && (
          <MessageHint>
            <h1>Select a message</h1>
            <div>
              Choose from your existing conversations, start a new one, or just
              keep swimming.
            </div>
          </MessageHint>
        )}

        {chatContent && (
          <>
            <div className="outer">
              {chatContent.map((chat) => (
                <Chat chat={chat} key={chat.id} />
              ))}
              <ChatBottom ref={chatRef}></ChatBottom>
            </div>
          </>
        )}
        {data.user.displayName && <Input></Input>}
      </div>
    </div>
  );
}
