import styled from "@emotion/styled";
import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import camera from "../../img/camera.jpg";
import Loader from "../loader/loader";
import { changeLoaderState } from "../../store/loaderSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setPersonalPhotoUpload,
  removePersonalPhotoUpload,
} from "../../store/profileSlice";
import { updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { AuthContext } from "../../context/AuthContext";
import { db, storage } from "../../firebase";

export function ProfileEdit({ uploadPhoto, setOpenEdit, profile }) {
  const loader = useSelector((state) => state.loader.loader);
  const personalPhotoUpload = useSelector(
    (state) => state.profile.personalPhotoUpload
  );
  const dispatch = useDispatch();
  const { currentUser } = useContext(AuthContext);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setEditName(profile.displayName);
    setEditBio(profile.bio);
    setEditLocation(profile.location);
    setReady(true);
  }, []);
  function changePhoto(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", () => {
      const dataURL = reader.result;
      const editPersonalPhoto = document.querySelector(
        ".profile-edit-personal-photo"
      );
      editPersonalPhoto.style.backgroundImage = `url(${dataURL})`;
    });
  }
  const saveProfile = async () => {
    dispatch(changeLoaderState());
    await updateProfile(currentUser, {
      displayName: editName,
    });
    await updateDoc(doc(db, "users", currentUser.uid), {
      displayName: editName,
      bio: editBio,
      location: editLocation,
    });
    const q = query(
      collection(db, "posts"),
      where("author.uid", "==", currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.docs.map((doc) =>
      updateDoc(doc.ref, { "author.displayName": editName })
    );
    if (personalPhotoUpload) {
      const imageRef = ref(storage, `profile picture/${currentUser.uid}`);
      uploadBytes(imageRef, personalPhotoUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          updateDoc(doc(db, "users", currentUser.uid), {
            photoURL: url,
          });
          updateProfile(currentUser, {
            photoURL: url,
          });
        });
      });
    }
    dispatch(changeLoaderState());
    const editHint = document.querySelector(".edit-hint");
    editHint.style.display = "inline-block";
    setTimeout(() => {
      editHint.style.display = "none";
    }, 3000);
  };
  const Camera = styled.img`
    position: relative;
    top: 100px;
    left: 80px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    user-select: none;
  `;
  const PhotoUpload = styled.input`
    display: none;
  `;
  return (
    <div className="profile-edit-block">
      <form>
        <div className="profile-edit-header">
          <div
            className="close-btn"
            onClick={() => {
              dispatch(removePersonalPhotoUpload());
              setOpenEdit(false);
            }}
          >
            <svg viewBox="-3 -8 30 30">
              <g>
                <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
              </g>
            </svg>
          </div>
          <span>Edit Profile</span>
          {loader && <Loader></Loader>}
          <div className="edit-hint">更新成功!</div>
          <button
            type="button"
            onClick={() => {
              saveProfile();
            }}
          >
            Save
          </button>
        </div>
        <div className="profile-edit-cover-photo"></div>
        <div
          className="profile-edit-personal-photo"
          style={{ backgroundImage: `url(${profile.photoURL})` }}
        >
          {ready ? null : <Skeleton />}
          <Camera src={camera} onClick={uploadPhoto} />
          <PhotoUpload
            type={"file"}
            onChange={(e) => {
              changePhoto(e);
              dispatch(setPersonalPhotoUpload(e.target.files[0]));
            }}
            id={"photo-upload"}
          ></PhotoUpload>
        </div>

        <div className="edit name">
          <div>
            <label>Name</label>
          </div>
          <div>
            <input
              value={editName}
              onChange={(e) => {
                setEditName(e.target.value);
              }}
              onFocus={(e) => {
                e.target.parentNode.parentNode.style.border =
                  "2px solid #4ca5bd";
              }}
              onBlur={(e) => {
                e.target.parentNode.parentNode.style.border = "1px solid #000";
              }}
            ></input>
          </div>
        </div>
        <div className="edit bio">
          <div>
            <label>Bio</label>
          </div>
          <div>
            <textarea
              value={editBio}
              onChange={(e) => {
                setEditBio(e.target.value);
              }}
              onFocus={(e) => {
                e.target.parentNode.parentNode.style.border =
                  "2px solid #4ca5bd";
              }}
              onBlur={(e) => {
                e.target.parentNode.parentNode.style.border = "1px solid #000";
              }}
            ></textarea>
          </div>
        </div>
        <div className="edit location">
          <div>
            <label>Location</label>
          </div>
          <div>
            <input
              value={editLocation}
              onChange={(e) => {
                setEditLocation(e.target.value);
              }}
              onFocus={(e) => {
                e.target.parentNode.parentNode.style.border =
                  "2px solid #4ca5bd";
              }}
              onBlur={(e) => {
                e.target.parentNode.parentNode.style.border = "1px solid #000";
              }}
            ></input>
          </div>
        </div>
      </form>
    </div>
  );
}
