import styled from "@emotion/styled";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import { PostElement } from "./post/PostElement";

export const Bookmark = () => {
  const { currentUser } = useContext(AuthContext);
  const [collected, setCollected] = useState();
  const [collectedList, setCollectedList] = useState();
  const [postIsLoading, setPostIsLoading] = useState(true);
  const postList = useSelector((state) => state.postList.postList);
  const Header = styled.div`
    height: 100px;
    box-sizing: border-box;
    padding: 20px 20px;
    border: 1px solid #8c969b;
    position: sticky;
    top: -0.5px;
    background-color: rgba(232, 204, 172, 0.3);
    backdrop-filter: blur(6px);
    z-index: 5;
  `;
  const Bookmark = styled.div`
    height: 100%;
    width: 600px;
    margin-left: 250px;
    position: relative;
    font-family: math;
    @media (max-width: 1280px) {
      margin-left: 12%;
      width: 550px;
    }
    @media (max-width: 1020px) {
      margin-left: 15%;
      width: 600px;
    }
    @media (max-width: 740px) {
      margin-left: 15%;
      width: 80%;
    }
    @media (max-width: 500px) {
      margin-left: 0;
      width: 100%;
    }
  `;
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const getCollected = async () => {
      let collectedList = [];
      const q = query(
        collection(db, "collected"),
        where("collectedAccount", "array-contains", currentUser.uid)
      );
      const collected = await getDocs(q);
      collected.forEach((doc) => {
        collectedList.push(doc.id);
        setCollected(collectedList);
      });
      setPostIsLoading(false);
    };
    getCollected();
  }, []);
  useEffect(() => {
    if (collected) {
      const collectedlist = postList.filter((post) =>
        collected.includes(post.id)
      );
      setCollectedList(collectedlist);
    }
  }, [collected]);
  return (
    <Bookmark>
      <Header>Collected</Header>
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
      {collectedList &&
        collectedList.map((post) => (
          <PostElement key={post.id} post={post}></PostElement>
        ))}
    </Bookmark>
  );
};
