import React, { useState, useEffect, useContext } from "react";
import { ProfileEdit } from "./ProfileEdit";
import { PostElement } from "../post/PostElement";
import "../../scss/profile.scss";
import { db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "../popup/Popup";
import styled from "@emotion/styled";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfile,
  removePersonalPhotoUpload,
} from "../../store/profileSlice";
import { getUserInfo } from "../../store/userInfoSlice";
import { updateProfile } from "firebase/auth";
import Loader from "../loader/loader";
import { Follow } from "./Follower";

window.addEventListener(
  "click",
  () => {
    document.querySelectorAll(".post-options").forEach((element) => {
      element.classList.remove("show");
    });
  },
  true
);
const LoaderWrapper = styled.div`
  z-index: 2;
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 80px 0 0 40px;
  background-color: #e8ccac;
`;

export function Profile() {
  const profile = useSelector((state) => state.profile.profile);
  const postList = useSelector((state) => state.postList.postList);
  const dispatch = useDispatch();
  const [profileIsLoading, setProfileIsLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [followers, setFollowers] = useState();
  const [followed, setFollowed] = useState(false);
  const [showFollow, setShowFollow] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  let { userId } = useParams();
  const personalPostList = postList.filter((post) => post.author.uid == userId);
  const editPersonalPhoto = document.querySelector(
    ".profile-edit-personal-photo"
  );
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [userId]);
  useEffect(() => {
    const loadProfile = async () => {
      await getDoc(doc(db, "users", userId)).then((res) => {
        dispatch(getProfile(res.data()));
      });
      setProfileIsLoading(false);
    };
    loadProfile();
  }, [userId]);
  useEffect(() => {
    const getFollowers = async () => {
      await getDoc(doc(db, "followers", userId)).then((res) => {
        setFollowers(res.data());
      });
    };
    getFollowers();
  }, [userId]);
  useEffect(() => {
    if (followers) {
      setFollowed(
        followers.follower.find((user) => user == currentUser.uid) !== undefined
      );
    }
  }, [followers]);
  function uploadPhoto() {
    const personalPhotoUpload = document.querySelector("#photo-upload");
    personalPhotoUpload.click();
  }
  const handleClick = async () => {
    const combinedId =
      currentUser.uid > userId
        ? currentUser.uid + userId
        : userId + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), {});
        await setDoc(
          doc(db, "userChats", currentUser.uid),
          {
            [combinedId]: {
              date: serverTimestamp(),
              lastMessage: {
                text: "",
              },
              userInfo: {
                displayName: profile.displayName,
                photoURL:
                  profile.photoURL == undefined ? null : profile.photoURL,
                uid: userId,
              },
            },
          },
          { merge: true }
        );
        navigate("/messages");
      } else {
        navigate("/messages");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const PersonalPhoto = styled.div`
    z-index: 3;
    position: absolute;
    top: 170px;
    left: 3%;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 5px solid #e8dfd2;
    background-image: url(${profile && profile.photoURL});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  `;
  const Message = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid #666;
    cursor: pointer;
    margin: 0 10px;
    &:hover {
      background-color: rgba(170, 170, 170, 0.5);
    }
  `;
  const Button = styled.button`
    background-color: #e8dfd2;
    padding: 8px 15px;
    border: 1px solid #888;
    border-radius: 50px;
    cursor: pointer;
    &:hover {
      filter: brightness(1.2);
    }
  `;
  const Follower = styled.div`
    margin-left: 20px;
    font-size: 18px;
    span {
      margin: 0 10px 0 3px;
      color: #666;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  `;
  function handleFollow() {
    if (followed) {
      const newFollower = followers.follower.filter(
        (user) => user !== currentUser.uid
      );
      const newFollowers = { ...followers, follower: newFollower };
      setFollowers(newFollowers);
      updateDoc(doc(db, "followers", currentUser.uid), {
        following: arrayRemove(userId),
      });
      updateDoc(doc(db, "followers", userId), {
        follower: arrayRemove(currentUser.uid),
      });
    } else {
      const newFollower = [...followers.follower, currentUser.uid];
      const newFollowers = { ...followers, follower: newFollower };
      setFollowers(newFollowers);
      updateDoc(doc(db, "followers", currentUser.uid), {
        following: arrayUnion(userId),
      });
      updateDoc(doc(db, "followers", userId), {
        follower: arrayUnion(currentUser.uid),
      });
      addDoc(collection(db, "users", userId, "notifications"), {
        action: "follow",
        user: currentUser.uid,
        content: "",
        state: "unread",
        timestamp: serverTimestamp(),
      });
    }
  }
  const FollowUserWrapper = styled.div`
    z-index: 6;
    position: fixed;
    top: 25%;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px;
    width: 400px;
    height: 500px;
    background-color: #e8dfd2;
    border-radius: 12px;
    box-shadow: 0px 0px 10px 5px #777;
    overflow-y: auto;
    @media (max-width: 500px) {
      width: 90%;
    }
    @media (max-height: 800px) {
      top: 15%;
    }
    @media (max-height: 700px) {
      top: 5%;
    }
    &::-webkit-scrollbar {
      width: 7px;
      height: 15px;
    }
    &::-webkit-scrollbar-button {
      background: transparent;
    }
    &::-webkit-scrollbar-track-piece {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: #aaa;
      border: 1px solid slategrey;
    }
  `;
  const FollowTitle = styled.div`
    width: 100%;
    height: 60px;
  `;
  const Close = styled.div`
    display: inline-block;
    width: 40px;
    height: 40px;
    margin: 3px 10px 0px 10px;
    border-radius: 50%;
    cursor: pointer;
    vertical-align: sub;
    &:hover {
      background-color: rgba(136, 136, 136, 0.6);
    }
  `;
  return (
    <>
      <div className="profile">
        <div className="profile-cover-photo"></div>
        <PersonalPhoto></PersonalPhoto>
        <div className="profile-content">
          {profileIsLoading && (
            <LoaderWrapper>
              <Skeleton
                width={"80%"}
                height={"10px"}
                baseColor="#aaa"
                highlightColor="#ccc"
                style={{ marginBottom: ".6em" }}
              />
              <Skeleton
                width={"70%"}
                height={"10px"}
                baseColor="#aaa"
                highlightColor="#ccc"
                style={{ marginBottom: ".6em" }}
              />
              <Skeleton
                width={"60%"}
                height={"10px"}
                baseColor="#aaa"
                highlightColor="#ccc"
                style={{ marginBottom: ".6em" }}
              />
            </LoaderWrapper>
          )}
          <div className="editbar">
            {currentUser.uid != userId && (
              <>
                <Message title="Message" onClick={handleClick}>
                  <svg fill="#333" viewBox="1 -3 32 32">
                    <g>
                      <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path>
                    </g>
                  </svg>
                </Message>
                <Button onClick={handleFollow}>
                  {followed ? "Following" : "Follow"}
                </Button>
              </>
            )}
            {currentUser.uid == userId && (
              <Button
                onClick={() => {
                  setOpenEdit(true);
                }}
              >
                Edit Profile
              </Button>
            )}
          </div>
          <div className="profile-name">
            <b>{profile?.displayName}</b>
          </div>
          <div className="profile-account">{profile?.email}</div>
          <p className="profile-bio">{profile?.bio}</p>
          <Follower>
            {followers?.following.length}
            <span
              onClick={() => {
                setShowFollow("following");
              }}
            >
              Following
            </span>
            {followers?.follower.length}
            <span
              onClick={() => {
                setShowFollow("follower");
              }}
            >
              Follower
            </span>
          </Follower>
        </div>
        {personalPostList.map((value) => (
          <PostElement key={value.id} post={value} />
        ))}
      </div>
      <Popup
        open={openEdit}
        onClose={() => {
          dispatch(removePersonalPhotoUpload());
          setOpenEdit(false);
        }}
      >
        <ProfileEdit
          uploadPhoto={uploadPhoto}
          setOpenEdit={setOpenEdit}
          profile={profile}
        />
      </Popup>

      <Popup
        open={showFollow}
        onClose={() => {
          setShowFollow(false);
        }}
      >
        <FollowUserWrapper>
          <FollowTitle>
            <Close
              onClick={() => {
                setShowFollow(false);
              }}
            >
              <svg viewBox="-3 -8 30 30">
                <g>
                  <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                </g>
              </svg>
            </Close>
            {showFollow && showFollow.replace("f", "F")}
          </FollowTitle>
          {showFollow &&
            followers[showFollow].map((follow) => (
              <Follow
                key={follow}
                follow={follow}
                setShowFollow={setShowFollow}
              ></Follow>
            ))}
        </FollowUserWrapper>
      </Popup>
    </>
  );
}
