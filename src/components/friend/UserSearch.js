import styled from "@emotion/styled";
import React from "react";
import { useNavigate } from "react-router-dom";

export const UserSearch = ({ user, setValue, setShowResult }) => {
  const navigate = useNavigate();
  const User = styled.div`
    width: 100%;
    height: auto;
    padding: 10px 0;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      background-color: rgba(99, 99, 99, 0.4);
    }
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
  const Name = styled.div`
    text-align: initial;
    font-size: 18px;
  `;
  const Email = styled.div`
    color: #777;
    width: 70%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    text-align: initial;
  `;
  return (
    <User
      onClick={() => {
        navigate(`/${user.id}`);
        setValue("");
        setShowResult(false);
      }}
    >
      <Photo></Photo>
      <Info>
        <Name>{user.data.displayName}</Name>
        <Email>{user.data.email}</Email>
      </Info>
    </User>
  );
};
