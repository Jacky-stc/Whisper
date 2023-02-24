import styled from "@emotion/styled";
import React, { useContext } from "react";
import { ChatContext } from "../../context/MessageContext";

export const User = ({ user }) => {
  const { dispatch } = useContext(ChatContext);
  const UserWrapper = styled.div`
    width: 100%;
    height: 80px;
    box-sizing: border-box;
    padding: 15px;
    border-radius: 50px;
    cursor: pointer;
    &:hover {
      background-color: rgba(170, 170, 170, 0.5);
    }
  `;
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
  const Name = styled.div``;
  const Email = styled.div`
    color: #777;
    width: 70%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  `;
  const handleSelect = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };
  return (
    <UserWrapper
      onClick={() => {
        handleSelect(user[1].userInfo);
      }}
    >
      <Photo></Photo>
      <Info>
        <Name>{user[1].userInfo.displayName}</Name>
        <Email>{user[1].lastMessage.text}</Email>
      </Info>
    </UserWrapper>
  );
};
