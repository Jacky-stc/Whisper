import styled from "@emotion/styled";
import React from "react";

export const Recommend = ({ user }) => {
  const RecFriend = styled.div`
    width: 100%;
    height: 80px;
    box-sizing: border-box;
    padding: 15px;
  `;
  const Photo = styled.div`
    display: inline-block;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    background-image: url(${user.data.photoURL
      ? user.data.photoURL
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
    width: 65%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  `;
  const Add = styled.button`
    border: none;
    border-radius: 20px;
    position: absolute;
    top: 10px;
    right: 0;
    background-color: #fff;
    padding: 5px 15px;
    cursor: pointer;
    &:hover {
      filter: brightness(0.8);
    }
  `;
  return (
    <RecFriend>
      <Photo></Photo>
      <Info>
        <Name>{user.data.displayName}</Name>
        <Email>{user.data.email}</Email>
        <Add>Follow</Add>
      </Info>
    </RecFriend>
  );
};
