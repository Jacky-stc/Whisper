import styled from "@emotion/styled";
import { signOut } from "firebase/auth";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import Popup from "./popup/Popup";
import whisper from "../img/whisper.jpg";

export function Navbar() {
  const { currentUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const LogoutBlock = styled.div`
    z-index: 2;
    width: 320px;
    height: 355px;
    position: fixed;
    top: 50%;
    left: 50%;
    background-color: #e8ccac;
    border-radius: 20px;
    box-sizing: border-box;
    padding: 33px;
    transform: translate(-50%, -50%);
  `;
  const Icon = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: block;
    margin: 0 auto;
  `;
  const Title = styled.h1`
    font-size: 24px;
    color: #111;
  `;
  const Content = styled.p`
    font-size: 18px;
    color: #555;
  `;
  const LogoutBtn = styled.div`
    background-color: #fff;
    box-sizing: border-box;
    padding: 10px 15px;
    border-radius: 20px;
    margin: 20px 0;
    text-align: center;
    font-size: 18px;
    user-select: none;
    cursor: pointer;
    &:hover {
      filter: brightness(0.9);
    }
    &:active {
      filter: brightness(0.8);
    }
  `;
  const CancelBtn = styled.div`
    background: none;
    box-sizing: border-box;
    padding: 10px 15px;
    border-radius: 20px;
    border: 1px solid #666;
    margin: 20px 0;
    background-color: #e8ccac;
    text-align: center;
    font-size: 18px;
    user-select: none;
    cursor: pointer;
    &:hover {
      background-color: rgba(256, 256, 256, 0.3);
    }
    &:active {
      background-color: rgba(256, 256, 256, 0.4);
    }
  `;
  return (
    <header>
      <div className="navbar">
        <nav>
          <Link to={"/"}>
            <div>
              <svg>
                <g>
                  <path d="M12 9c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 6c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-13.304L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM19 19.5c0 .276-.224.5-.5.5h-13c-.276 0-.5-.224-.5-.5V8.429l7-4.375 7 4.375V19.5z"></path>
                </g>
              </svg>
              Home
            </div>
          </Link>
          <Link to={"/messages"}>
            <div>
              <svg>
                <g>
                  <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path>
                </g>
              </svg>
              Messages
            </div>
          </Link>
          <Link to={`/${currentUser.uid}`}>
            <div>
              <svg>
                <g>
                  <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"></path>
                </g>
              </svg>
              Profile
            </div>
          </Link>
          <a>
            <div>
              <svg>
                <g>
                  <path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z"></path>
                </g>
              </svg>
              Notifications
            </div>
          </a>
          <a>
            <div>
              <svg>
                <g>
                  <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path>
                </g>
              </svg>
              Bookmarks
            </div>
          </a>
          <a>
            <div>
              <svg>
                <g>
                  <path d="M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5v-15zM5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2z"></path>
                </g>
              </svg>
              Club
            </div>
          </a>
        </nav>
      </div>
      <div
        className="logout"
        onClick={() => {
          setOpen(true);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 30 30"
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
        <span style={{ verticalAlign: "top" }}>Logout</span>
      </div>
      <Popup
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <LogoutBlock>
          <Icon src={whisper}></Icon>
          <Title>Log out of Whisper?</Title>
          <Content>You can always log back in any time.</Content>
          <LogoutBtn
            role={"button"}
            onClick={() => {
              signOut(auth);
            }}
          >
            Log out
          </LogoutBtn>
          <CancelBtn
            role={"button"}
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </CancelBtn>
        </LogoutBlock>
      </Popup>
    </header>
  );
}
