import React, { useContext, useEffect, useRef, useState } from "react";
import "../../scss/post.scss";
import "../../scss/postarea.scss";
import { PostElement } from "./PostElement";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { storage } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Popup from "../popup/Popup";
import styled from "@emotion/styled";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import * as icon from "../icon/icon.js";
import { Image, Layer, Stage } from "react-konva";
import useImage from "use-image";
import { useDispatch, useSelector } from "react-redux";
import { addPostList } from "../../store/postListSlice";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

export function Post({ postIsLoading }) {
  const postList = useSelector((state) => state.postList.postList);
  const dispatch = useDispatch();
  const { currentUser } = useContext(AuthContext);
  const textRef = useRef();
  const [postImageUpload, setPostImageUpload] = useState();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const postImage = document.querySelector(".post-image");
  const stageRef = useRef();
  function previewImage(image) {
    const file = image;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", () => {
      const postImage = document.querySelector(".post-image");
      postImage.src = reader.result;
    });
  }
  window.addEventListener(
    "click",
    () => {
      document.querySelectorAll(".post-options").forEach((element) => {
        element.classList.remove("show");
      });
      setShowEmoji(false);
    },
    false
  );
  useEffect(() => {
    if (textRef) {
      console.log(textRef.current.style.height);
      textRef.current.style.height = "0px";
      const scrollHeight = textRef.current.scrollHeight;
      textRef.current.style.height = scrollHeight + "px";
    }
  }, [textRef, value]);
  const LoaderWrapper = styled.div`
    z-index: 100;
    display: flex;
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    height: 100%;
    padding-top: 30px;
    background-color: #e8ccac;
    outline: 1px solid #8c969b;
  `;
  const LeftSkeleton = styled.div`
    margin: 0 0.5rem;
  `;
  const RightSkeleton = styled.div`
    flex: 1;
  `;
  const ImageEditBlock = styled.div`
    z-index: 3;
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 550px;
    height: auto;
    padding-bottom: 60px;
    border-radius: 12px;
    background-color: #e8dfd2;
  `;
  const ImageEditBlockTitle = styled.div`
    width: 100%;
    height: 60px;
    box-sizing: border-box;
    padding: 10px;
  `;
  const Back = styled.div`
    display: inline-block;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin-right: 40px;
    cursor: pointer;
    &:hover {
      background-color: #666;
    }
  `;
  const Save = styled.button`
  border-radius: 20px;
  position: relative;
  left: 50%;
  border: none;
  padding: 10px 15px;
  vertical-align: top;
  cursor: pointer;
  &:hover{
    filter:brightness(0.8);
  }
}
  `;
  function addPostItem(e) {
    console.log(
      e.target.parentNode.parentNode.querySelector("form").elements[0]
    );
    console.log(
      e.target.parentNode.parentNode.querySelector("form").elements[0].value
    );
    const optionOne =
      e.target.parentNode.parentNode.querySelector("form").elements[0].value;
    const optionTwo =
      e.target.parentNode.parentNode.querySelector("form").elements[1].value;
    async function storePostItem() {
      try {
        console.log(optionOne);
        const docRef = await addDoc(collection(db, "posts"), {
          timestamp: serverTimestamp(),
          author: {
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            uid: currentUser.uid,
          },
          imageURL: "",
          content: value,
          poll: showPoll
            ? { option1: { [optionOne]: [] }, option2: { [optionTwo]: [] } }
            : null,
          likes: 0,
        });
        await setDoc(doc(db, "likes", docRef.id), { likeAccount: [] });
        await setDoc(doc(db, "comments", docRef.id), {});
        await setDoc(doc(db, "collected", docRef.id), { collectedAccount: [] });

        if (postImageUpload) {
          const imageRef = ref(storage, `post images/${docRef.id}`);
          uploadBytes(imageRef, postImageUpload).then((snapshot) => {
            console.log(snapshot);
            getDownloadURL(snapshot.ref).then((url) => {
              console.log(url);
              updateDoc(doc(db, "posts", docRef.id), {
                imageURL: url,
              });
              dispatch(
                addPostList({
                  id: docRef.id,
                  timestamp: serverTimestamp(),
                  author: {
                    displayName: currentUser.displayName,
                    email: currentUser.email,
                    photoURL: currentUser.photoURL,
                    uid: currentUser.uid,
                  },
                  imageURL: url,
                  content: value,
                  poll: showPoll
                    ? {
                        option1: { [optionOne]: [] },
                        option2: { [optionTwo]: [] },
                      }
                    : null,
                  likes: 0,
                })
              );
            });
            setValue("");
            document.querySelector(".post-image").src = "";
          });
        } else {
          dispatch(
            addPostList({
              id: docRef.id,
              timestamp: serverTimestamp(),
              author: {
                displayName: currentUser.displayName,
                email: currentUser.email,
                photoURL: currentUser.photoURL,
                uid: currentUser.uid,
              },
              imageURL: "",
              content: value,
              poll: showPoll
                ? { option1: { [optionOne]: [] }, option2: { [optionTwo]: [] } }
                : null,
              likes: 0,
            })
          );
          setValue("");
          setPostImageUpload(false);
        }
      } catch (e) {
        console.error(e);
      }
    }
    storePostItem();
    setPostImageUpload(null);
  }
  const EditImage = () => {
    const [image] = useImage(postImage?.src, "anonymous");
    const scalex = postImage?.offsetWidth / image?.width;
    const scaley = postImage?.offsetHeight / image?.height;
    const [scale, setScale] = useState(1);
    const [maxX, setMaxX] = useState(scalex);
    const [maxY, setMaxY] = useState(scaley);
    const handleWheel = (e) => {
      // if (
      //   e.target.attrs.x < 0 &&
      //   Math.abs(e.target.attrs.x) >
      //     (e.target.attrs.scaleX - scalex) * image.width
      // ) {
      //   console.log("ok");
      //   return { x: (e.target.attrs.scaleX - scalex) * image.width * -1 };
      // }
      if (e.evt.deltaY < 0) {
        setScale(scale * 1.05);
      } else {
        if (scale <= 1) {
          return;
        }
        setScale(scale / 1.05);
      }
    };
    const handleDrag = (e) => {
      setMaxX(e.target.attrs.scaleX);
      setMaxY(e.target.attrs.scaleY);
    };
    return (
      <Image
        image={image}
        scaleX={scalex * scale}
        scaleY={scaley * scale}
        draggable={true}
        dragBoundFunc={(pos) => {
          return {
            x:
              pos.x > 0
                ? 0
                : Math.abs(pos.x) > (maxX - scalex) * image?.width
                ? (maxX - scalex) * image?.width * -1
                : pos.x,
            y:
              pos.y > 0
                ? 0
                : Math.abs(pos.y) > (maxY - scaley) * image?.height
                ? (maxY - scaley) * image?.height * -1
                : pos.y,
          };
        }}
        onWheel={(e) => {
          handleWheel(e);
        }}
        onDragMove={(e) => {
          handleDrag(e);
        }}
      />
    );
  };
  const handleExport = () => {
    const uri = stageRef.current.toDataURL();

    const decodedUri = window.decodeURI(uri);
    const postImage = document.querySelector(".post-image");
    postImage.src = decodedUri;
    setOpen(false);
  };
  const PostAuthorPhoto = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-image: url(${currentUser.photoURL
      ? currentUser.photoURL
      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    cursor: pointer;
  `;
  const Header = styled.div`
    height: 120px;
    box-sizing: border-box;
    padding: 20px 20px;
    border-bottom: 1px solid #8c969b;
  `;
  const PostBtn = styled.button`
    position: relative;
    padding: 12px 18px;
    background-color: #ff9367;
    border: none;
    border-radius: 24px;
    cursor: pointer;
    &:hover {
      background-color: rgba(255, 147, 103, 0.9);
    }
    &:active {
      background-color: rgba(255, 147, 103, 0.7);
    }
    &:disabled {
      background-color: rgba(255, 147, 103, 0.5);
      cursor: not-allowed;
    }
  `;
  const PostLeft = styled.div`
    box-sizing: border-box;
    display: inline-block;
    padding: 10px;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      cursor: pointer;
    }
  `;
  const PostRight = styled.div`
    display: inline-block;
    flex: 1;
    vertical-align: top;
  `;
  const IconWrapper = styled.div`
    display: inline-block;
    margin-right: 8px;
    width: 40px;
    height: 40px;
    vertical-align: bottom;
    border-radius: 50%;
    &:hover {
      background-color: #8c969b;
    }
  `;
  const Emoji = styled.div`
    display: ${showEmoji ? "block" : "none"};
    position: absolute;
    z-index: 2;
  `;
  const Vote = styled.form`
    display: ${showPoll ? "block" : "none"};
    width: 90%;
    height: auto;
    border-radius: 20px;
    margin: 20px auto;
    border: 1px solid #666;
  `;
  const VoteOption = styled.div`
    position: relative;
    background: none;
    border-radius: 8px;
    border: 1px solid #666;
    width: 85%;
    height: 60px;
    box-sizing: border-box;
    margin: 20px;
    input {
      position: absolute;
      background: none;
      outline: none;
      border: none;
      width: 100%;
      padding: 15px;
      top: 10px;
      box-sizing: border-box;
      z-index: 1;
      ::placeholder {
        user-select: none;
        color: transparent;
      }
    }
    input:not(:placeholder-shown) + label {
      top: -3px;
      left: 5px;
      font-size: 18px;
      color: #777;
    }
    input:focus + label {
      top: -3px;
      left: 5px;
      font-size: 18px;
      color: #3788ff;
    }
    &:focus-within {
      border: 2px solid #3788ff;
    }
    label {
      position: absolute;
      top: 15px;
      left: 15px;
      padding: 5px;
      color: #777;
      transition: 0.5s;
    }
  `;
  const RemovePoll = styled.div`
  text-align: center;
  box-sizing: border-box;
  padding: 15px;
  height: 50px;
  width: 100%;
  border-top: 1px solid #666;
  border-radius: 0 0 20px 20px;
  font-size: 18px;
  color: #ff2f2f;
  user-select:none;
  cursor:pointer;
  &:hover{
    background-color: rgba(255,47,47,0.2);
  }
  &:active{
    background-color: rgba(255,47,47,0.4);
  }
}
  `;
  return (
    <div className="post">
      <Header>Home</Header>
      <div className="post-area">
        <PostLeft>
          <PostAuthorPhoto></PostAuthorPhoto>
        </PostLeft>
        <div className="post-area-right">
          <textarea
            ref={textRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            spellCheck={false}
            placeholder={showPoll ? "Ask a question..." : "What's happening?"}
          ></textarea>
          <Vote>
            <VoteOption>
              <input
                id="option1"
                placeholder={"text"}
                autoComplete={"off"}
              ></input>
              <label htmlFor="option1">Option1</label>
            </VoteOption>
            <VoteOption>
              <input
                id="option2"
                placeholder={"text"}
                autoComplete={"off"}
              ></input>
              <label htmlFor="option2">Option2</label>
            </VoteOption>
            <RemovePoll
              onClick={() => {
                setShowPoll(false);
              }}
            >
              Remove Poll
            </RemovePoll>
          </Vote>
          {postImageUpload && (
            <div className="post-image-container">
              <img draggable="false" className="post-image"></img>
              <div
                className="post-image-remove"
                onClick={() => {
                  setPostImageUpload(null);
                }}
              >
                ×
              </div>
              <div
                className="post-image-edit-btn"
                onClick={() => {
                  setOpen(true);
                }}
              >
                Edit
              </div>
            </div>
          )}

          <div className="post-area-right-navbar">
            <div className="post-area-icon">
              <IconWrapper
                onClick={() => {
                  const postImageInput =
                    document.querySelector(".post-image-input");
                  postImageInput.click();
                }}
              >
                <icon.postImageIcon></icon.postImageIcon>
              </IconWrapper>
              <IconWrapper>
                <icon.GifIcon></icon.GifIcon>
              </IconWrapper>
              <IconWrapper
                onClick={() => {
                  setShowPoll(true);
                }}
              >
                <icon.pollIcon></icon.pollIcon>
              </IconWrapper>
              <IconWrapper
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEmoji(true);
                }}
              >
                <icon.emojiIcon></icon.emojiIcon>
              </IconWrapper>
            </div>
            <input
              type={"file"}
              className="post-image-input"
              onChange={(e) => {
                console.log(e.target.files[0]);
                previewImage(e.target.files[0]);
                setPostImageUpload(e.target.files[0]);
              }}
            ></input>
            <PostBtn
              onClick={(e) => {
                addPostItem(e);
              }}
              disabled={value ? false : true}
            >
              Whisper
            </PostBtn>
          </div>
          <Emoji
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Picker
              data={data}
              onEmojiSelect={(emoji) =>
                setValue((prevValue) => prevValue + emoji.native)
              }
            ></Picker>
          </Emoji>
        </div>
      </div>
      {postIsLoading && (
        <LoaderWrapper>
          <LeftSkeleton>
            <Skeleton
              circle
              baseColor="#aaa"
              highlightColor="#ccc"
              width={60}
              height={60}
            />
          </LeftSkeleton>
          <RightSkeleton>
            <Skeleton
              width={"90%"}
              height={"15px"}
              baseColor="#aaa"
              highlightColor="#ccc"
              style={{ marginBottom: ".6em" }}
            />
            <Skeleton
              width={"80%"}
              height={"15px"}
              baseColor="#aaa"
              highlightColor="#ccc"
              style={{ marginBottom: ".6em" }}
            />
            <Skeleton
              width={"70%"}
              height={"15px"}
              baseColor="#aaa"
              highlightColor="#ccc"
              style={{ marginBottom: ".6em" }}
            />
            <Skeleton
              width={"60%"}
              height={"15px"}
              baseColor="#aaa"
              highlightColor="#ccc"
              style={{ marginBottom: ".6em" }}
            />
          </RightSkeleton>
        </LoaderWrapper>
      )}
      {postList.map((p) => (
        <PostElement key={p.id} post={p} />
      ))}
      <Popup
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <ImageEditBlock>
          <ImageEditBlockTitle>
            <Back
              onClick={() => {
                setOpen(false);
              }}
            >
              <svg viewBox="-2 -7 28 28">
                <g>
                  <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                </g>
              </svg>
            </Back>
            Crop media
            <Save onClick={handleExport}>Save</Save>
          </ImageEditBlockTitle>
          <Stage
            width={postImage?.offsetWidth}
            height={postImage?.offsetHeight}
            style={{
              margin: `0 auto`,
              marginTop: `120px`,
              border: `1px solid #000`,
              width: postImage?.offsetWidth,
              height: postImage?.offsetHeight,
            }}
            ref={stageRef}
          >
            <Layer>
              <EditImage />
            </Layer>
          </Stage>
        </ImageEditBlock>
      </Popup>
    </div>
  );
}
