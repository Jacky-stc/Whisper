import styled from "@emotion/styled";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import "../../scss/friend.scss";
import { UserSearch } from "./UserSearch";
import { Recommend } from "./Recommend";

export function Friend() {
  const [value, setValue] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [userExist, setUserExist] = useState();
  const [result, setResult] = useState([]);
  const [recommend, setRecommend] = useState([]);
  useEffect(() => {
    if (value) {
      const getUser = async () => {
        const userList = [];
        const qName = query(
          collection(db, "users"),
          where("displayName", ">=", value),
          where("displayName", "<=", `${value}\uf8ff`)
        );
        const querysnapshot = await getDocs(qName);
        querysnapshot.forEach((doc) => {
          userList.push({ id: doc.id, data: doc.data() });
        });
        const qEmail = query(
          collection(db, "users"),
          where("email", ">=", value),
          where("email", "<=", `${value}\uf8ff`)
        );
        const querysnapshot2 = await getDocs(qEmail);
        querysnapshot2.forEach((doc) => {
          userList.push({ id: doc.id, data: doc.data() });
        });
        const userId = Object.keys(
          userList.reduce((obj, item) => {
            obj[item.id] = obj[item.id] || item.data;
            return obj;
          }, {})
        );
        const userData = Object.values(
          userList.reduce((obj, item) => {
            obj[item.id] = obj[item.id] || item.data;
            return obj;
          }, {})
        );
        const filteredArr = userId.map((value, i) => ({
          id: value,
          data: userData[i],
        }));
        if (userList.length == 0) {
          setUserExist(false);
        } else {
          setUserExist(true);
          setResult(filteredArr);
        }
      };
      getUser();
    }
  }, [value]);
  useEffect(() => {
    const getRecommend = async () => {
      const recommendList = [];
      const res = await getDocs(collection(db, "users"));
      res.forEach((element) => {
        recommendList.push({
          id: element.id,
          data: element.data(),
        });
      });
      const randomedList = [];
      for (let i = 0; i < 3; i++) {
        let randomNum = Math.floor(
          Math.random() * (recommendList.length - 1 - i)
        );
        randomedList.push(recommendList[randomNum]);
        recommendList.splice(randomNum, 1);
      }
      setRecommend(randomedList);
    };
    getRecommend();
  }, []);
  const Icon = styled.div`
    display: inline-block;
    vertical-align: top;
    margin: 10px 0 0 20px;
  `;
  const Title = styled.div`
    font-size: 26px;
    width: 100%;
    height: 60px;
    box-sizing: border-box;
    padding: 10px 20px;
    line-height: 50px;
    color: #444;
  `;
  const Result = styled.div`
    position: absolute;
    width: 100%;
    min-height: 100px;
    height: auto;
    border-radius: 12px;
    background-color: #182c38;
    box-shadow: 0px 0px 5px 3px #e5e5e5;
    max-height: 600px;
    padding: 10px 0;
    overflow-y: overlay;
  `;
  const Hint = styled.div`
    color: #ddd;
    font-size: 15px;
    text-align: center;
    margin-top: 10px;
    font-family: math;
  `;
  window.addEventListener("click", () => {
    setShowResult(false);
  });
  return (
    <div className="friend">
      <div className="search-bar">
        <Icon>
          <svg fill="#666">
            <g>
              <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
            </g>
          </svg>
        </Icon>
        <input
          type={"text"}
          placeholder="Search Whisper"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onFocus={() => {
            setShowResult(true);
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        ></input>
        {showResult && (
          <Result
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Hint>
              {value
                ? userExist
                  ? result.map((user) => (
                      <UserSearch
                        key={user.id}
                        user={user}
                        setValue={setValue}
                        setShowResult={setShowResult}
                      ></UserSearch>
                    ))
                  : `No result for ${value}`
                : "Try searching for people, topics, or keywords"}
            </Hint>
          </Result>
        )}
      </div>
      <div className="recommend-wrapper">
        <Title>Recommend</Title>
        {recommend &&
          recommend.map((user) => (
            <Recommend key={user.id} user={user}></Recommend>
          ))}
      </div>
    </div>
  );
}
