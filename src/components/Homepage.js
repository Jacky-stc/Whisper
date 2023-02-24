import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../scss/homepage.scss";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import homepageBackground from "../img/homepage.jpg";
import { doc, setDoc } from "firebase/firestore";
import styled from "@emotion/styled";
import Loader from "./loader/loader";
import post from "../img/post.jpg";
import chat from "../img/chat.jpg";
import profile from "../img/profile.jpg";

export function Homepage() {
  const [logLoading, setLogLoading] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [LogError, setLogError] = useState(null);
  const [regError, setRegError] = useState(null);
  const [regSuccess, setRegsuccess] = useState(null);
  const [show, setShow] = useState(true);
  const navigate = useNavigate();
  function handleRegisterSubmit(e) {
    e.preventDefault();
    const displayName = e.target[0].value;
    const registerEmail = e.target[1].value;
    const registerPassword = e.target[2].value;
    if (displayName == "") {
      setRegError("姓名欄位不能為空");
      return;
    }
    if (registerEmail == "") {
      setRegError("email欄位不能為空");
      return;
    }
    if (registerPassword == "") {
      setRegError("密碼欄位不能為空");
      return;
    }
    setRegLoading(true);
    createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
      .then((userCredential) => {
        // Signed in
        updateProfile(userCredential.user, {
          displayName: displayName,
        });
        setDoc(doc(db, "users", userCredential.user.uid), {
          displayName: displayName,
          email: registerEmail,
          bio: "",
          location: "",
        });
        setDoc(doc(db, "followers", userCredential.user.uid), {
          following: [],
          follower: [],
        });
        setRegLoading(false);
        setRegsuccess("註冊成功！請從登入頁面登入");
      })
      .catch((error) => {
        setRegLoading(false);
        const errorCode = error.code;
        const errorList = {
          "auth/internal-error": "註冊失敗，請重新註冊。",
          "auth/invalid-email": "不合法的email格式",
          "auth/weak-password": "密碼不能小於6位數",
        };
        setRegError(errorList[errorCode]);
        const errorMessage = error.message;
      });
  }
  function handleSignin(e) {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    setLogError(null);
    setLogLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLogLoading(false);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorList = {
          "auth/internal-error": "登入失敗。",
          "auth/user-not-found": "查無此用戶",
          "auth/wrong-password": "密碼錯誤",
        };
        setLogLoading(false);
        setLogError(errorList[errorCode]);
      });
  }
  const Button = styled.button`
    width: 200px;
    height: 45px;
    margin-top: 30px;
    margin-left: 50px;
    background: none;
    border: 1px solid #444;
    border-radius: 12px;
    cursor: pointer;
    &:hover {
      background-color: rgba(250, 235, 215, 0.5);
    }
  `;
  const Title = styled.div`
    font-size: 72px;
  `;
  const Form = styled.div`
    width: 400px;
    height: auto;
    position: absolute;
    left: 100%;
    transform: translateX(-110%);
    margin-right: 40px;
    top: 15%;
    border: 1px solid #888;
    border-radius: 8px;
    justify-content: center;
    background-color: #c7b59c;
    font-family: "Cormorant Garamond", serif;
    box-shadow: 0px 0px 10px #555;
    display: flex;
    p {
      text-align: center;
      a {
        cursor: pointer;
        &:hover {
          text-decoration: 1px solid underline;
        }
      }
    }
  `;
  const LoaderWrapper = styled.div`
    display: block;
    margin: 0 auto;
    width: 20px;
    height: 20px;
  `;
  const ErrorHint = styled.div`
    text-align: center;
    font-size: 16px;
    color: red;
  `;
  const SuccessHint = styled.div`
    text-align: center;
    font-size: 16px;
    color: green;
  `;
  const Introduce = styled.div`
    width: 100%;
    height: 80%;
    background-color: #ebebeb;
  `;
  const Introduce2 = styled.div`
    width: 100%;
    height: 80%;
    background-color: #e8dfd2;
  `;
  const Wrapper = styled.div`
    position: relative;
    top: 150px;
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
  `;
  const Image = styled.img`
    display: inline-block;
    width: 50%;
    border-radius: 20px;
    box-shadow: 0px 0px 5px 5px #aaa;
  `;
  const Explanation = styled.div`
    display: inline-block;
    width: 35%;
  `;
  const Slogan = styled.h2`
    font-size: xx-large;
  `;
  const Content = styled.div`
    line-height: 40px;
  `;
  return (
    <>
      <div
        className="homepage-background"
        style={{ backgroundImage: `url(${homepageBackground})` }}
      >
        {show ? (
          <Form>
            <form onSubmit={handleSignin}>
              <Title>Login</Title>
              <Outer>
                <div>email</div>
                <Info type={"email"}></Info>
              </Outer>
              <Outer>
                <div>password</div>
                <Info type={"password"}></Info>
              </Outer>
              {LogError && <ErrorHint>{LogError}</ErrorHint>}
              {logLoading && (
                <LoaderWrapper>
                  <Loader></Loader>
                </LoaderWrapper>
              )}
              <Button>Sign in</Button>
              <p>
                Did not have an account yet ?{" "}
                <a
                  onClick={() => {
                    setLogError(null);
                    setShow(!show);
                  }}
                >
                  register
                </a>
              </p>
            </form>
          </Form>
        ) : (
          <Form>
            <form onSubmit={handleRegisterSubmit}>
              <Title>Register</Title>
              <Outer>
                <div>Name</div>
                <Info type={"text"}></Info>
              </Outer>
              <Outer>
                <div>Email</div>
                <Info type={"email"}></Info>
              </Outer>
              <Outer>
                <div>password</div>
                <Info type={"password"}></Info>
              </Outer>
              {regError && <ErrorHint>{regError}</ErrorHint>}
              {regSuccess && <SuccessHint>{regSuccess}</SuccessHint>}
              {regLoading && (
                <LoaderWrapper>
                  <Loader></Loader>
                </LoaderWrapper>
              )}
              <Button>Sign up</Button>
              <p>
                Already have an account ?{" "}
                <a
                  onClick={() => {
                    setRegError(null);
                    setShow(!show);
                  }}
                >
                  Login
                </a>
              </p>
            </form>
          </Form>
        )}

        <div className="homepage-intro">
          <div>Whisper</div>
          <p>
            Whisper your secrets to the world.
            <br />
            Let your whisper be heard.
          </p>
        </div>
      </div>
      <Introduce>
        <Wrapper>
          <Explanation>
            <Slogan>Connect with the world, share your story</Slogan>
            <Content>
              Our platform offers a variety of features to help you express
              yourself and connect with others, including the ability to post
              pictures, texts, and polls.
            </Content>
          </Explanation>
          <Image src={post}></Image>
        </Wrapper>
      </Introduce>
      <Introduce2>
        <Wrapper>
          <Image src={chat}></Image>
          <Explanation>
            <Slogan>Stay close, without distance</Slogan>
            <Content>
              when you want to chat with your friends, our chat feature makes it
              easy to stay connected no matter where you are.
            </Content>
          </Explanation>
        </Wrapper>
      </Introduce2>
      <Introduce>
        <Wrapper>
          <Explanation>
            <Slogan>Your social media, your way</Slogan>
            <Content>
              You can create your own personal profile page to showcase your
              interests and personality.
            </Content>
          </Explanation>
          <Image src={profile}></Image>
        </Wrapper>
      </Introduce>
    </>
  );
}
const Outer = styled.div`
  margin: 20px 0;
  font-size: 24px;
`;
const Info = styled.input`
  box-sizing: border-box;
  width: 300px;
  height: 45px;
  background: none;
  border: 1px solid #444;
  border-radius: 12px;
  outline: none;
  padding: 20px;
  color: #444;
  &:focus {
    background-color: rgba(250, 235, 215, 0.5);
  }
`;
