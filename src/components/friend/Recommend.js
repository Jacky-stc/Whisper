import styled from "@emotion/styled";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase";
import "../../scss/personal.scss";
import { DisplayInfo } from "../DisplayInfo";

export const Recommend = React.memo(({ user }) => {
  const [follow, setFollow] = useState(null);
  const [followed, setFollowed] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const ref = useRef();
  const nameRef = useRef();
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
    cursor: pointer;
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
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 50%;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  `;
  const Email = styled.div`
    color: #777;
    width: 50%;
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
    ${followed ? "background: none;border: 1px solid #666;" : null}
    padding: 5px 15px;
    cursor: pointer;
    &:hover {
      filter: brightness(0.8);
      ${followed
        ? "color:red; border: 1px solid red; background-color: rgba(255,0,0,0.2);"
        : null}
    }
  `;

  useEffect(() => {
    try {
      const getFollower = async () => {
        const res = await getDoc(doc(db, "followers", user.id));
        setFollow(res.data());
        setFollowed(
          res.data().follower.find((user) => user == currentUser.uid) !==
            undefined
        );
      };
      getFollower();
    } catch (error) {
      console.error(error);
    }
  }, []);
  useEffect(() => {
    let hoverTimeout;
    const personalBlock = document.querySelector(`.p${user.id}`);
    if (ref && ref.current) {
      ref.current.addEventListener("mouseenter", (e) => {
        hoverTimeout = setTimeout(() => {
          personalBlock.style.display = "block";
          personalBlock.style.left = e.pageX - 125 + "px";
          personalBlock.style.top = e.pageY + 15 + "px";
        }, 500);
      });
      ref.current.addEventListener("mouseleave", () => {
        personalBlock.style.display = "none";
        clearTimeout(hoverTimeout);
      });
      nameRef.current.addEventListener("mouseenter", (e) => {
        hoverTimeout = setTimeout(() => {
          personalBlock.style.display = "block";
          personalBlock.style.left = e.pageX - 125 + "px";
          personalBlock.style.top = e.pageY + 15 + "px";
        }, 500);
      });
      nameRef.current.addEventListener("mouseleave", () => {
        personalBlock.style.display = "none";
        clearTimeout(hoverTimeout);
      });
    }
  }, [follow, ref, nameRef]);
  function handleFollow() {
    if (followed) {
      const newFollower = follow.follower.filter(
        (user) => user !== currentUser.uid
      );
      const newFollowers = { ...follow, follower: newFollower };
      setFollow(newFollowers);
      updateDoc(doc(db, "followers", currentUser.uid), {
        following: arrayRemove(user.id),
      });
      updateDoc(doc(db, "followers", user.id), {
        follower: arrayRemove(currentUser.uid),
      });
      setFollowed(false);
    } else {
      const newFollower = [...follow.follower, currentUser.uid];
      const newFollowers = { ...follow, follower: newFollower };
      setFollow(newFollowers);
      updateDoc(doc(db, "followers", currentUser.uid), {
        following: arrayUnion(user.id),
      });
      updateDoc(doc(db, "followers", user.id), {
        follower: arrayUnion(currentUser.uid),
      });
      setFollowed(true);
    }
  }
  return (
    <RecFriend>
      <Photo
        ref={ref}
        onClick={() => {
          navigate(`/${user.id}`);
        }}
      ></Photo>
      <Info>
        <Name
          ref={nameRef}
          onClick={() => {
            navigate(`/${user.id}`);
          }}
        >
          {user.data.displayName}
        </Name>
        <Email>{user.data.email}</Email>
        <Add
          onMouseEnter={(e) => {
            e.target.textContent == "Following"
              ? (e.target.textContent = "Unfollow")
              : null;
          }}
          onMouseLeave={(e) => {
            e.target.textContent == "Unfollow"
              ? (e.target.textContent = "Following")
              : null;
          }}
          onClick={handleFollow}
        >
          {followed ? "Following" : "Follow"}
        </Add>
      </Info>
      <DisplayInfo
        id={user.id}
        photoURL={user.data.photoURL}
        name={user.data.displayName}
        email={user.data.email}
        bio={user.data.bio}
        follow={follow}
      ></DisplayInfo>
    </RecFriend>
  );
});
