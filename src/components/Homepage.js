import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../scss/homepage.scss";
import { auth, db, storage } from "../firebase";
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
import logo from "../img/whisper.jpg";
import defaultUserPhoto from "../img/defaultUser.jpg";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export function Homepage() {
  const [logLoading, setLogLoading] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [LogError, setLogError] = useState(null);
  const [regError, setRegError] = useState(null);
  const [regSuccess, setRegsuccess] = useState(null);
  const [logEmail, setLogEmail] = useState("testing@gmail.com");
  const [logPassword, setLogPassword] = useState("testtest");
  const [regEmail, setRegEmail] = useState("");
  const [regName, setRegName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [show, setShow] = useState(true);
  const navigate = useNavigate();
  const introRef = useRef();
  const introRef2 = useRef();
  const introRef3 = useRef();
  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "0px 0px 0px 0px",
      threshold: 0.2,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("show-homepage-content");
      });
    }, option);
    observer.observe(introRef.current);
    observer.observe(introRef2.current);
    observer.observe(introRef3.current);
  }, []);
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
        const fetchImage = async () => {
          const file = await fetch(defaultUserPhoto)
            .then((response) => response.blob())
            .then(
              (blob) => new File([blob], "test.jpg", { type: "image/jpeg" })
            );
          const imageRef = ref(
            storage,
            `profile picture/${userCredential.user.uid}`
          );
          uploadBytes(imageRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
              setDoc(doc(db, "users", userCredential.user.uid), {
                displayName: displayName,
                email: registerEmail,
                bio: "",
                location: "",
                photoURL: url,
              });
              updateProfile(userCredential.user, {
                photoURL: url,
              });
            });
          });
        };
        fetchImage();
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
    display: block;
    margin: 0 auto;
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
  const ImageOuter = styled.div`
    display: flex;
    align-items: center;
    width: 50%;
    @media (max-width: 1200px) {
      width: 60%;
    }
    @media (max-width: 768px) {
      width: 80%;
      margin: 40px auto;
    }
  `;
  const Image = styled.img`
    display: inline-block;
    width: 100%;
    border-radius: 20px;
    box-shadow: 0px 0px 5px 5px #aaa;
  `;
  const Explanation = styled.div`
    display: inline-block;
    width: 35%;
    @media (max-width: 768px) {
      width: 80%;
      display: block;
      margin: 0 auto;
    }
  `;
  const Slogan = styled.h2`
    font-size: xx-large;
    margin-top: 0;
    @media (max-height: 790px) {
      font-size: large;
    }
  `;
  const Content = styled.div`
    line-height: 40px;
  `;
  const Logo = styled.div`
    display: inline-block;
    margin-right: 15px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-image: url(${logo});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  `;
  const Name = styled.div`
    display: inline-block;
    vertical-align: super;
    font-family: "Cormorant Garamond", serif;
    font-size: 36px;
    font-weight: bold;
  `;
  return (
    <>
      <div
        className="homepage-background"
        style={{ backgroundImage: `url(${homepageBackground})` }}
      >
        <div className="homepage-header">
          <Logo></Logo>
          <Name>Whisper</Name>
        </div>
        {show ? (
          <div className="auth-form">
            <form onSubmit={handleSignin}>
              <Title>Login</Title>
              <Outer>
                <div>email</div>
                <Info
                  type={"email"}
                  value={logEmail}
                  onChange={(e) => {
                    setLogEmail(e.target.value);
                  }}
                ></Info>
              </Outer>
              <Outer>
                <div>password</div>
                <Info
                  type={"password"}
                  value={logPassword}
                  onChange={(e) => {
                    setLogPassword(e.target.value);
                  }}
                ></Info>
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
          </div>
        ) : (
          <div className="auth-form">
            <form onSubmit={handleRegisterSubmit}>
              <Title>Register</Title>
              <Outer>
                <div>Name</div>
                <Info
                  type={"text"}
                  value={regName}
                  onChange={(e) => {
                    setRegName(e.target.value);
                  }}
                ></Info>
              </Outer>
              <Outer>
                <div>Email</div>
                <Info
                  type={"email"}
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value);
                  }}
                ></Info>
              </Outer>
              <Outer>
                <div>password</div>
                <Info
                  type={"password"}
                  value={regPassword}
                  onChange={(e) => {
                    setRegPassword(e.target.value);
                  }}
                ></Info>
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
          </div>
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
      <div className="homepage-introduce">
        <div className="homepage-content" ref={introRef}>
          <Explanation>
            <Slogan>Connect with the world, share your story</Slogan>
            <Content>
              Our platform offers a variety of features to help you express
              yourself and connect with others, including the ability to post
              pictures, texts, and polls.
            </Content>
          </Explanation>
          <ImageOuter>
            <Image src={post}></Image>
          </ImageOuter>
        </div>
      </div>
      <div className="homepage-introduce2">
        <div
          className="homepage-content"
          ref={introRef2}
          style={{ flexFlow: "row-reverse" }}
        >
          <Explanation>
            <Slogan>Stay close, without distance</Slogan>
            <Content>
              when you want to chat with your friends, our chat feature makes it
              easy to stay connected no matter where you are.
            </Content>
          </Explanation>
          <ImageOuter>
            <Image src={chat}></Image>
          </ImageOuter>
        </div>
      </div>
      <div className="homepage-introduce">
        <div className="homepage-content" ref={introRef3}>
          <Explanation>
            <Slogan>Your social media, your way</Slogan>
            <Content>
              You can create your own personal profile page to showcase your
              interests and personality.
            </Content>
          </Explanation>
          <ImageOuter>
            <Image src={profile}></Image>
          </ImageOuter>
        </div>
      </div>
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
