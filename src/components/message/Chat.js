import styled from "@emotion/styled";
import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";

export const Chat = ({ chat }) => {
  const { currentUser } = useContext(AuthContext);

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
    vertical-align: sub;
    ${chat.data.author == currentUser.uid
      ? "margin-right"
      : "margin-left"}: 12px;
  `;
  return (
    <Wrapper>
      {chat.data.author == currentUser.uid ? (
        <OuterRight>
          <Message>{chat.data.message}</Message>
          <Photo></Photo>
        </OuterRight>
      ) : (
        <OuterLeft>
          <Photo></Photo>
          <Message>{chat.data.message}</Message>
        </OuterLeft>
      )}
    </Wrapper>
  );
};
