import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

export const Comment = ({ data }) => {
  const navigate = useNavigate();
  const ref = useRef();
  useEffect(() => {
    ref.current?.scrollIntoView({ bahavior: "smooth" });
  }, [data]);
  const Wrapper = styled.div`
    width: 100%;
    height: 60px;
    padding-top: 10px;
    padding-bottom: 15px;
    margin-top: 10px;
    border-bottom: 1px solid #999;
  `;
  const Profile = styled.div`
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-image: url(${data.author.photoURL
      ? data.author.photoURL
      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"});
    background-size: cover;
    background-position: center;
    vertical-align: top;
    cursor: pointer;
  `;
  const Outer = styled.div`
    display: inline-block;
    width: 90%;
  `;
  const Name = styled.div`
    display: inline-block;
    margin: 0px 5px 10px 10px;
    font-size: 24px;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  `;
  const Content = styled.div`
  box-sizing: border-box;
  padding-left: 10px;
  width: 70%;
  height: auto;
  font-size: 22px;
}
  `;
  return (
    <Wrapper ref={ref}>
      <Profile
        onClick={() => {
          navigate(`/${data.author.uid}`);
        }}
      ></Profile>
      <Outer>
        <Name
          onClick={() => {
            navigate(`/${data.author.uid}`);
          }}
        >
          {data.author.displayName}
        </Name>
        <span style={{ color: "#999" }}>{data.author.email}</span>
        <Content>{data.content}</Content>
      </Outer>
    </Wrapper>
  );
};
