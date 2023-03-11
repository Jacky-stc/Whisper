import styled from "@emotion/styled";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";

export const Follow = ({ follow, setShowFollow }) => {
  const [userInfo, setUserInfo] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    const getFollowInfo = async () => {
      const res = await getDoc(doc(db, "users", follow));
      setUserInfo(res.data());
    };
    getFollowInfo();
  }, [follow]);
  const User = styled.div`
    width: 100%;
    height: auto;
    padding: 10px 0;
    box-sizing: border-box;
    cursor: pointer;
    border-radius: 12px;
    padding-left: 5px;
    &:hover {
      background-color: rgba(99, 99, 99, 0.4);
    }
  `;
  const Photo = styled.div`
    display: inline-block;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    background-image: url(${userInfo?.photoURL});
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
        navigate(`/${follow}`);
        setShowFollow(false);
      }}
    >
      <Photo></Photo>
      <Info>
        <Name>{userInfo?.displayName}</Name>
        <Email>{userInfo?.email}</Email>
      </Info>
    </User>
  );
};
