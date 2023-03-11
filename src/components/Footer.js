import styled from "@emotion/styled";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const Footer = () => {
  const { currentUser } = useContext(AuthContext);
  const Footer = styled.div`
    z-index: 100;
    display: none;
    position: fixed;
    width: 100%;
    height: 40px;
    bottom: 0;
    background-color: #e8ccac;
    border-top: 1px solid #8c969b;
    nav {
      display: flex;
      justify-content: space-evenly;
    }
    @media (max-width: 500px) {
      display: block;
    }
  `;
  const Wrapper = styled.div`
    box-sizing: border-box;
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    &:hover {
      background-color: #e8ccac;
      filter: brightness(0.8);
    }
    &:active {
      background-color: #e8ccac;
      filter: brightness(0.7);
    }
  `;

  return (
    <Footer>
      <nav>
        <Link to={"/"}>
          <Wrapper>
            <svg viewBox="-3 -7 30 30">
              <g>
                <path d="M12 9c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 6c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-13.304L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM19 19.5c0 .276-.224.5-.5.5h-13c-.276 0-.5-.224-.5-.5V8.429l7-4.375 7 4.375V19.5z"></path>
              </g>
            </svg>
          </Wrapper>
        </Link>
        <Link to={"/messages"}>
          <Wrapper>
            <svg viewBox="-3 -7 30 30">
              <g>
                <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path>
              </g>
            </svg>
          </Wrapper>
        </Link>
        <Link to={`/${currentUser.uid}`}>
          <Wrapper>
            <svg viewBox="-3 -7 30 30">
              <g>
                <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"></path>
              </g>
            </svg>
          </Wrapper>
        </Link>
        <Link to={"/bookmarks"}>
          <Wrapper>
            <svg viewBox="-3 -7 30 30">
              <g>
                <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path>
              </g>
            </svg>
          </Wrapper>
        </Link>
      </nav>
    </Footer>
  );
};
