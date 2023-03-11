import styled from "@emotion/styled";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../scss/sidebar.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showLogOut, closeLogOut } from "../store/portalSlice";

export const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Title = styled.div`
  width: 100%;
  height: 59px;
  padding: 10px 0;
  box-sizing: border-box;
}
  `;
  const UserPhoto = styled.div`
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-image: url(${currentUser.photoURL
      ? currentUser.photoURL
      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  `;
  const Name = styled.div`
    font-size: 18px;
    margin: 5px 0;
  `;
  const Email = styled.div`
    color: #666;
    margin-bottom: 10px;
  `;
  const Container = styled.div`
    width: 100%;
    height: 60px;
  `;
  const Close = styled.div`
    display: inline-block;
    margin-left: 70px;
    svg {
      fill: #f5f5f5;
    }
  `;
  const Icon = styled.div`
    display: inline-block;
    margin: 15px 0;
    svg {
      fill: #f5f5f5;
    }
  `;
  const Tag = styled.div`
    display: inline-block;
    vertical-align: super;
  `;
  return (
    <div className="sidebar">
      <Title>
        Account Info
        <Close
          onClick={() => {
            document.querySelector(".sidebar").classList.remove("show-sidebar");
          }}
        >
          <svg viewBox="-3 -8 30 30">
            <g>
              <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
            </g>
          </svg>
        </Close>
      </Title>
      <UserPhoto></UserPhoto>
      <Name>{currentUser.displayName}</Name>
      <Email>{currentUser.email}</Email>
      <Container
        onClick={() => {
          navigate(`/${currentUser.uid}`);
        }}
      >
        <Icon>
          <svg>
            <g>
              <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"></path>
            </g>
          </svg>
        </Icon>
        <Tag>Profile</Tag>
      </Container>
      <Container
        onClick={() => {
          navigate("/bookmarks");
        }}
      >
        <Icon>
          <svg>
            <g>
              <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path>
            </g>
          </svg>
        </Icon>
        <Tag>Bookmarks</Tag>
      </Container>
      <Container
        onClick={() => {
          dispatch(showLogOut());
        }}
      >
        <Icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </Icon>
        <Tag>Logout</Tag>
      </Container>
    </div>
  );
};
