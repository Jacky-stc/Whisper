import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import "../../scss/comment.scss";

export const Comment = ({ data }) => {
  const navigate = useNavigate();
  const ref = useRef();
  useEffect(() => {
    ref.current?.scrollIntoView({ bahavior: "smooth" });
  }, [data]);
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
    &:hover {
      filter: brightness(0.9);
    }
    &:active {
      filter: brightness(0.8);
    }
  `;
  const Outer = styled.div`
    display: inline-block;
    width: 90%;
    @media (max-width: 500px) {
      width: 80%;
    }
  `;
  const Name = styled.div`
    display: inline-block;
    margin: 0px 5px 10px 10px;
    font-size: 20px;
    max-width: 50%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    vertical-align: middle;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
    @media (max-width: 600px) {
      font-size: 18px;
    }
  `;
  const Content = styled.div`
  box-sizing: border-box;
  padding-left: 10px;
  width: 70%;
  height: auto;
  font-size: 18px;
  @media (max-width: 600px) {
    font-size: 16px;
  }
}
  `;
  const Email = styled.div`
    color: rgb(153, 153, 153);
    max-width: 40%;
    vertical-align: top;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
  `;
  return (
    <div className="comment-outer" ref={ref}>
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
        <Email>{data.author.email}</Email>
        <Content>{data.content}</Content>
      </Outer>
    </div>
  );
};
