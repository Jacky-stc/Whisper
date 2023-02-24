import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { db, storage } from "../../firebase";
import "../../scss/postarea.scss";
import * as icon from "../icon/icon.js";
import Popup from "../popup/Popup";
import { deleteObject, ref } from "firebase/storage";
import styled from "@emotion/styled";
import { Comment } from "./Comment";
import { useDispatch, useSelector } from "react-redux";
import { deletePostList } from "../../store/postListSlice";

export const PostElement = React.memo(({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComment, setShowComment] = useState(false);
  const [poll, setPoll] = useState([]);
  const [polled, setPolled] = useState(false);
  const commentRef = useRef();
  const q = query(
    collection(db, "comments", post.id, "comment"),
    orderBy("timestamp", "asc")
  );
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "likes", post.id), (doc) => {
      setLikes(doc.data().likeAccount);
    });
    const unComments = onSnapshot(q, (doc) => {
      const commentList = [];
      doc.forEach((e) => {
        const data = { id: e.id, data: e.data() };
        commentList.push(data);
        setComments(commentList);
      });
    });
  }, [post.id]);
  useEffect(() => {
    setLiked(likes.find((element) => element == currentUser.uid) !== undefined);
  }, [likes]);
  const likePost = async () => {
    if (liked) {
      await updateDoc(doc(db, "likes", post.id), {
        likeAccount: arrayRemove(currentUser.uid),
      });
    } else {
      await updateDoc(doc(db, "likes", post.id), {
        likeAccount: arrayUnion(currentUser.uid),
      });
    }
  };
  useEffect(() => {
    if (post.poll) {
      const unsub = onSnapshot(doc(db, "posts", post.id), (doc) => {
        let pollList = [];
        pollList.push(
          doc.data().poll.option1[Object.keys(post.poll.option1)[0]]
        );
        pollList.push(
          doc.data().poll.option2[Object.keys(post.poll.option2)[0]]
        );
        setPoll(pollList);
      });
    }
  }, [post.id]);
  useEffect(() => {
    if (poll[0]) {
      setPolled(
        poll[0].find((user) => user == currentUser.uid) !== undefined ||
          poll[1].find((user) => user == currentUser.uid) !== undefined
      );
    }
  }, [poll]);

  function deletePost(postId) {
    deleteDoc(doc(db, "posts", postId));
    deleteDoc(doc(db, "likes", postId));
    deleteDoc(doc(db, "comments", postId));
    deleteDoc(doc(db, "collected", postId));
    deleteObject(ref(storage, `post images/${postId}`));
    dispatch(deletePostList(postId));
  }
  const submitComment = async () => {
    await addDoc(collection(db, "comments", post.id, "comment"), {
      timestamp: serverTimestamp(),
      author: {
        displayName: currentUser.displayName,
        email: currentUser.email,
        photoURL: currentUser.photoURL,
        uid: currentUser.uid,
      },
      content: commentRef.current.value,
    });
  };
  const CommentBlock = styled.div`
    z-index: 3;
    position: fixed;
    top: 35%;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px;
    width: 520px;
    height: 400px;
    background-color: #e8dfd2;
    border-radius: 12px;
    box-shadow: 0px 0px 10px 5px #777;
  `;
  const CommentWrapper = styled.div`
    width: 100%;
    height: 350px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #aaa #ddd;
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
  const InputWrapper = styled.div`
    position: absolute;
    width: 100%;
    bottom: 15px;
    border-radius: 12px;
  `;
  const InputProfile = styled.div`
    width: 40px;
    height: 40px;
    display: inline-block;
    vertical-align: middle;
    border-radius: 50%;
    margin-right: 20px;
    background-image: url(${currentUser.photoURL
      ? currentUser.photoURL
      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  `;
  const CommentInput = styled.input`
    box-sizing: border-box;
    padding: 12px;
    width: 65%;
    height: 30px;
    background: none;
    border: 2px solid #666;
    border-right: none;
    border-radius: 12px 0 0 12px;
    &:focus {
      outline: none;
      border: 2px solid #4ca5bd;
    }
  `;
  const CommentButton = styled.button`
    height: 30px;
    border: 2px solid #666;
    background-color: #ffb165;
    border-radius: 0 12px 12px 0;
    cursor: pointer;
    &:hover {
      filter: brightness(0.9);
    }
  `;
  const PostAuthorPhoto = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-image: url(${post.author.photoURL
      ? post.author.photoURL
      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    cursor: pointer;
  `;
  const PollWrapper = styled.div`
    width: 100%;
    height: auto;
  `;
  const Outer = styled.div`
    position: relative;
    width: 90%;
    height: auto;
    border-radius: 20px;
    box-sizing: border-box;
    padding: 6px;
    margin: 5px 0;

    ${currentUser.uid == post.author.uid || polled
      ? `display:flex;
      justify-content:space-between;
      `
      : `border: 2px solid rgb(0 112 188); 
      color: rgb(0 112 188); 
      user-select: none;
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 112, 188, 0.2);
      }
      &:active {
        background-color: rgba(0, 112, 188, 0.3);
        filter: brightness(1.2);
      }
      `}
  `;
  const Option = styled.div`
    z-index: 1;
    text-align: center;
    ${currentUser.uid == post.author.uid || polled ? "margin-left:15px" : null}
  `;
  const RatioBar1 = styled.div`
    position: absolute;
    background-color: rgba(217, 232, 255, 0.8);
    filter: brightness(1.2);
    min-width: 7px;
    width: ${(poll[0]?.length / (poll[0]?.length + poll[1]?.length)) * 100}%;
    border-radius: 7px;
    top: 3px;
    bottom: 3px;
    left: 5px;
  `;
  const RatioBar2 = styled.div`
    position: absolute;
    background-color: rgba(217, 232, 255, 0.8);
    filter: brightness(1.2);
    min-width: 7px;
    width: ${(poll[1]?.length / (poll[0]?.length + poll[1]?.length)) * 100}%;
    border-radius: 7px;
    top: 3px;
    bottom: 3px;
    left: 5px;
  `;
  const Ratio = styled.div`
    z-index: 1;
  `;
  const VoteNum = styled.span`
  font-size: 17px;
    margin-left: 5px;
    color: #666;
}
  `;
  function voteOption1() {
    if (!currentUser.uid == post.author.uid && !polled) {
      updateDoc(doc(db, "posts", post.id), {
        ["poll.option1." + Object.keys(post.poll.option1)[0]]: arrayUnion(
          currentUser.uid
        ),
      });
    }
  }
  function voteOption2() {
    if (currentUser.uid !== post.author.uid && !polled) {
      updateDoc(doc(db, "posts", post.id), {
        ["poll.option2." + Object.keys(post.poll.option2)[0]]: arrayUnion(
          currentUser.uid
        ),
      });
    }
  }
  const Time = styled.span`
    font-size: 16px;
    color: #666;
    margin-left: 10px;
  `;
  return (
    <div className="post-area" key={post.id}>
      <div className="post-area-left">
        <PostAuthorPhoto
          onClick={() => {
            navigate(`/${post.author.uid}`);
          }}
        ></PostAuthorPhoto>
      </div>
      <div className="post-area-right">
        <div className="post-area-account">
          <b
            onClick={() => {
              navigate(`/${post.author.uid}`);
            }}
          >
            {post.author.displayName}
          </b>
          <Time>
            ·
            {new Date(post.timestamp * 1000).toLocaleDateString("en-US", {
              hour12: false,
              day: "numeric",
              month: "short",
            })}
          </Time>
          <div className="post-options" id={post.id}>
            {currentUser.uid == post.author.uid ? (
              <div
                className="delete"
                onClick={() => {
                  deletePost(post.id);
                }}
              >
                <icon.deleteIcon />
                <span>Delete</span>
              </div>
            ) : (
              <div className="mute">
                <icon.muteIcon />
                <span>Mute</span>
              </div>
            )}

            <div
              className="report"
              onClick={() => {
                console.log(comments);
              }}
            >
              <icon.reportIcon />
              <span>Report</span>
            </div>
          </div>
          <div
            style={{ display: "inline" }}
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById(post.id).classList.add("show");
            }}
          >
            <icon.optionsIcon />
          </div>
        </div>
        <div className="post-area-content">{post.content}</div>
        {post.imageURL && (
          <div className="post-image-container">
            <img src={post.imageURL}></img>
          </div>
        )}
        {post.poll && (
          <PollWrapper>
            <Outer onClick={voteOption1}>
              <Option>{Object.keys(post.poll.option1)[0]}</Option>
              {(currentUser.uid == post.author.uid || polled) && (
                <>
                  <RatioBar1></RatioBar1>
                  <Ratio>
                    {poll[0]?.length + poll[1]?.length == 0
                      ? "0%"
                      : Math.round(
                          (poll[0]?.length /
                            (poll[0]?.length + poll[1]?.length)) *
                            100
                        ) + "%"}
                  </Ratio>
                </>
              )}
            </Outer>
            <Outer onClick={voteOption2}>
              <Option>{Object.keys(post.poll.option2)[0]}</Option>
              {(currentUser.uid == post.author.uid || polled) && (
                <>
                  <RatioBar2></RatioBar2>
                  <Ratio>
                    {poll[0]?.length + poll[1]?.length == 0
                      ? "0%"
                      : Math.round(
                          (poll[1]?.length /
                            (poll[0]?.length + poll[1]?.length)) *
                            100
                        ) + "%"}
                  </Ratio>
                </>
              )}
            </Outer>
            <VoteNum>
              {poll[0]?.length + poll[1]?.length > 1
                ? poll[0]?.length + poll[1]?.length + "votes"
                : poll[0]?.length + poll[1]?.length + "vote"}
            </VoteNum>
          </PollWrapper>
        )}
        <div className="post-area-effectbar">
          <div
            className="effect-container like-effect"
            onClick={() => {
              likePost();
            }}
          >
            <div className="svg-container">
              {liked ? <icon.likedIcon /> : <icon.likeIcon />}
            </div>
            <span>{likes.length}</span>
          </div>
          <div
            className="effect-container comment-effect"
            onClick={() => {
              console.log("ok");
              setShowComment(true);
            }}
          >
            <div className="svg-container">
              <icon.commentIcon />
            </div>
            <span>{comments.length}</span>
          </div>
          <div className="effect-container collected-effect">
            <div className="svg-container">
              <icon.collectedIcon />
            </div>
          </div>
        </div>
      </div>
      <Popup
        open={showComment}
        onClose={() => {
          setShowComment(false);
        }}
      >
        <CommentBlock>
          <CommentWrapper>
            {comments.map((c) => (
              <Comment key={c.id} data={c.data} />
            ))}
          </CommentWrapper>
          <InputWrapper>
            <InputProfile />
            <CommentInput ref={commentRef} placeholder={"Say something..."} />
            <CommentButton
              onClick={() => {
                submitComment();
              }}
            >
              Comment
            </CommentButton>
          </InputWrapper>
        </CommentBlock>
      </Popup>
    </div>
  );
});
