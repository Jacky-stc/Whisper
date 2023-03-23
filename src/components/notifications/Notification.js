import styled from "@emotion/styled";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import "../../scss/notification.scss";

export const Notification = ({ not }) => {
  const [user, setUser] = useState();
  useEffect(() => {
    const getUser = async () => {
      const res = await getDoc(doc(db, "users", not.user));
      setUser(res.data());
    };
    getUser();
  }, [not]);
  const UserPhoto = styled.div`
    display: inline-block;
    width: 40px;
    height: 40px;
    margin-right: 20px;
    border-radius: 50%;
    background-image: url(${user?.photoURL});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  `;
  const Name = styled.div`
    display: inline-block;
    font-size: 18px;
    margin-right: 5px;
    max-width: 40%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    media(max-width:630px) {
      max-width: 35%;
    }
  `;
  const Action = styled.div`
    display: inline-block;
    overflow: hidden;
    font-size: 18px;
  `;
  const notCatigory = {
    like: "liked your post",
    follow: "follwed you",
    comment: "commented on your post",
  };
  const Content = styled.div`
    color: #666;
    margin-left: 60px;
    max-width: 60%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  `;
  return (
    <div className="notification">
      <UserPhoto></UserPhoto>
      <Name>{user?.displayName}</Name>
      <Action>{notCatigory[not.action]}</Action>
      <Content>{not.content}</Content>
    </div>
  );
};
