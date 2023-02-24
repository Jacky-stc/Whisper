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
        console.log(snapshot);
        const chatlist = [];
        snapshot.empty == true
          ? setChatContent(null)
          : snapshot.forEach((doc) => {
              const data = { id: doc.id, data: doc.data() };
              chatlist.push(data);
            });
        setChatContent(chatlist);
      });
      return () => {
        unsub();
      };
    };
    getChat();
  }, [data.chatId]);
  useEffect(() => {
    chatRef.current?.scrollIntoView();
  }, [chatContent]);
  const Wrapper = styled.div`
    flex: 1;
    margin-left: 250px;
    overflow-y: hidden;
    @media (max-width: 1200px) : {
      margin-left: 200px;
    }
  `;
  const Container = styled.div`
    display: inline-block;
    height: 100%;
    width: 380px;
    box-sizing: border-box;
    padding: 0px 10px;
    border-right: 1px solid #666;
  `;
  const Message = styled.div`
  position:relative;
  display: inline-block;
  width: 520px;
  height: 100%;
  vertical-align: top;
  border-right: 1px solid #666;
}
  `;
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
  `;
  const Outer = styled.div`
    position: relative;
    overflow-y: auto;
    height: 85%;
    scrollbar-width: thin;
    scrollbar-color: #aaa #ddd;
    &::-webkit-scrollbar {
      width: 7px;
      height: 15px;
    }
    &::-webkit-scrollbar-button {
      background: transparent;
    }
    &::-webkit-scrollbar-track-piece {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: #aaa;
      border: 1px solid slategrey;
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

  return (
    <Wrapper>
      <Container>
        <Title>Messages</Title>
        <SearchBar placeholder="Search Direct Message"></SearchBar>
        {chatUserList &&
          Object.entries(chatUserList)
            .sort((a, b) => b[1].date - a[1].date)
            .map((user) => <User key={user[0]} user={user} />)}
      </Container>
      <Message>
        {data.user.displayName && (
          <ChatTitle>{data.user.displayName}</ChatTitle>
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
            <Outer>
              {chatContent.map((chat) => (
                <Chat chat={chat} key={chat.id} />
              ))}
              <ChatBottom ref={chatRef}></ChatBottom>
            </Outer>
          </>
        )}
        {data.user.displayName && <Input></Input>}
      </Message>
    </Wrapper>
  );
}
