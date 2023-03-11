import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { addPostList } from "../../store/postListSlice";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Cropper from "react-easy-crop";
import { Sidebar } from "../Sidebar";

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

export function Post({ postIsLoading }) {
  const postList = useSelector((state) => state.postList.postList);
  const dispatch = useDispatch();
  const { currentUser } = useContext(AuthContext);
  const textRef = useRef();
  const [postImageUpload, setPostImageUpload] = useState();
  const [imageSrc, setImageSrc] = useState();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState();
  const imageRef = useRef();
  console.log(crop);
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
    const setPost = () => {
      const post = document.querySelector(".post");
      post.style.height = document.body.scrollHeight + "px";
    };
    if (document.readyState === "complete") {
      setPost();
    } else {
      window.addEventListener("load", setPost);
      return () => window.removeEventListener("load", setPost);
    }
  }, [document.body.scrollHeight]);
  useEffect(() => {
    if (textRef) {
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
  function addPostItem(e) {
    const optionOne =
      e.target.parentNode.parentNode.querySelector("form").elements[0].value;
    const optionTwo =
      e.target.parentNode.parentNode.querySelector("form").elements[1].value;
    async function storePostItem() {
      try {
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
    @media (max-width: 500px) {
      display: none;
    }
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
  const Footer = styled.div`
    display: none;
    width: 100%;
    height: 40px;
    bottom: 0;
    background-color: #e8ccac;
    @media (max-width: 500px) {
      display: block;
    }
  `;
  const ProfilePhoto = styled.div`
    display: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-image: url(${currentUser.photoURL
      ? currentUser.photoURL
      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    @media (max-width: 500px) {
      display: block;
    }
  `;
  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPostImageUpload(file);
      let imageDataUrl = await readFile(file);
      imageRef.current.src = imageDataUrl;

      setPostImageUpload(file);
      setImageSrc(imageDataUrl);
    }
  };
  const onCropComplete = useCallback((croppedArea, croppedAreaPixel) => {
    console.log(croppedArea.x, croppedAreaPixel.x);
    if (croppedArea.x == NaN || croppedAreaPixel.x == NaN) {
      console.log("return");
      return;
    } else {
      setCroppedAreaPixels(croppedAreaPixel);
    }
  }, []);
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
      image.src = url;
    });
  const dataURLtofile = (dataURL, fileName) => {
    let arr = dataURL.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  };
  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setPostImageUpload(dataURLtofile(croppedImage, `${currentUser.uid}.jpg`));
      imageRef.current.src = croppedImage;
      setOpen(false);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);
  const getCroppedImg = async () => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    canvas.width = image.width;
    canvas.height = image.height;

    // draw rotated image
    ctx.drawImage(image, 0, 0);

    // croppedAreaPixels values are bounding box relative
    // extract the cropped image using these values
    const data = ctx.getImageData(
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );
    console.log(croppedAreaPixels);
    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    // paste generated rotate image at the top left corner
    ctx.putImageData(data, 0, 0);

    // As Base64 string
    return canvas.toDataURL("image/jpeg");
  };
  const re = /(.|\s)*\S(.|\s)*/;
  return (
    <div className="post">
      <div className="post-header">
        Home
        <ProfilePhoto
          onClick={() => {
            document.querySelector(".sidebar").classList.add("show-sidebar");
          }}
        ></ProfilePhoto>
      </div>
      <div className="post-area">
        <PostLeft>
          <PostAuthorPhoto></PostAuthorPhoto>
        </PostLeft>
        <div className="post-area-right">
          <textarea
            ref={textRef}
            value={value}
            maxLength={500}
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
              <img
                draggable="false"
                className="post-image"
                ref={imageRef}
              ></img>
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
              <div
                className="icon-wrapper"
                onClick={() => {
                  const postImageInput =
                    document.querySelector(".post-image-input");
                  postImageInput.click();
                }}
              >
                <icon.postImageIcon></icon.postImageIcon>
              </div>
              <div
                className="icon-wrapper"
                onClick={() => {
                  setShowPoll(true);
                }}
              >
                <icon.pollIcon></icon.pollIcon>
              </div>
              <div
                className="icon-wrapper"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEmoji(true);
                }}
              >
                <icon.emojiIcon></icon.emojiIcon>
              </div>
            </div>
            <input
              type={"file"}
              className="post-image-input"
              onChange={onFileChange}
            ></input>
            <PostBtn
              onClick={(e) => {
                addPostItem(e);
              }}
              disabled={value.match(re)?.length > 0 ? false : true}
            >
              Whisper
            </PostBtn>
          </div>
          {showEmoji && (
            <div
              className="emoji"
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
            </div>
          )}
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
      <Footer></Footer>
      <Popup
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <div className="image-edit-block">
          <div className="title">
            <div
              className="back"
              onClick={() => {
                setOpen(false);
              }}
            >
              <svg viewBox="-2 -7 28 28">
                <g>
                  <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                </g>
              </svg>
            </div>
            Crop media
            <button className="save" onClick={showCroppedImage}>
              Save
            </button>
          </div>
          <div className="crop-container">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              cropSize={{
                width: imageRef.current?.getBoundingClientRect().width * 1.157,
                height:
                  imageRef.current?.getBoundingClientRect().height * 1.157,
              }}
              showGrid={false}
              zoomSpeed={0.3}
              objectFit={"contain"}
              style={{ cropAreaStyle: { border: "2px solid #3788ff" } }}
            ></Cropper>
          </div>
          <div className="control-bar">
            <input
              type={"range"}
              value={zoom}
              min={1}
              max={3}
              step={0.01}
              onInput={(e) => {
                e.preventDefault();
                setZoom(e.target.value);
              }}
            ></input>
          </div>
        </div>
      </Popup>
      <Sidebar></Sidebar>
    </div>
  );
}
