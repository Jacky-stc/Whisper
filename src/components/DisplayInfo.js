import styled from "@emotion/styled";
import React from "react";

export const DisplayInfo = React.memo(
  ({ id, photoURL, name, email, bio, follow }) => {
    const Personal = styled.div`
      z-index: 5;
      display: none;
      position: absolute;
      width: 250px;
      height: auto;
      background-color: #182c38;
      box-shadow: 0px 0px 5px 2px #a5a5a5;
      box-sizing: border-box;
      padding: 15px;
      border-radius: 12px;
      color: #f6e9e9;
    `;
    const PersonalPhoto = styled.div`
      display: inline-block;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #fff;
      background-image: url(${photoURL
        ? photoURL
        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"});
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    `;
    const PersonalInfo = styled.div`
      box-sizing: border-box;
      padding: 0px 5px;
    `;
    const PersonalName = styled.div`
      max-width: 80%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    `;
    const PersonalEmail = styled.div`
      color: #888;
      font-size: 16px;
      width: 80%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    `;
    const PersonalBio = styled.div``;
    const PersonalFollower = styled.div`
      font-size: 16px;
      margin-top: 10px;
      span {
        color: #666;
        margin: 0 10px 0 3px;
      }
    `;
    return (
      <Personal className={`p${id}`}>
        <PersonalPhoto></PersonalPhoto>
        <PersonalInfo>
          <PersonalName>{name}</PersonalName>
          <PersonalEmail>{email}</PersonalEmail>
          <PersonalBio>{bio}</PersonalBio>
          <PersonalFollower>
            {follow?.following.length}
            <span>following</span>
            {follow?.follower.length}
            <span>followers</span>
          </PersonalFollower>
        </PersonalInfo>
      </Personal>
    );
  }
);
