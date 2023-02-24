import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export const PostArea = () => {
  const { currentUser } = useContext(AuthContext);
  const textRef = useRef();
  const [value, setValue] = useState("");
  const [postImageUpload, setPostImageUpload] = useState();
  useEffect(() => {
    if (textRef) {
      // textRef.current.style.height = "0px";
      const scrollHeight = textRef.current.scrollHeight;
      textRef.current.style.height = scrollHeight + "px";
    }
  }, [textRef, value]);
  function previewImage(image) {
    const file = image;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", () => {
      const postImage = document.querySelector(".post-image");
      postImage.src = reader.result;
    });
  }
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
  return (
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
          placeholder="What's happening?"
        ></textarea>
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
            <div className="post-area-icon-container">
              <svg
                viewBox="-2 0 30 30"
                onClick={() => {
                  const postImageInput =
                    document.querySelector(".post-image-input");
                  postImageInput.click();
                }}
              >
                <g>
                  <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                </g>
              </svg>
            </div>
            <div className="post-area-icon-container">
              <svg viewBox="-2 0 30 30" onClick={() => {}}>
                <g>
                  <path d="M6 5c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zM2 7c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12V6h10v2zM6 15c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zm-4 2c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12v-2h10v2zM7 7c0 .552-.45 1-1 1s-1-.448-1-1 .45-1 1-1 1 .448 1 1z"></path>
                </g>
              </svg>
            </div>
            <div className="post-area-icon-container">
              <svg viewBox="-2 0 30 30" onClick={() => {}}>
                <g>
                  <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z"></path>
                </g>
              </svg>
            </div>
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
          <button
            onClick={() => {
              addPostItem(textRef.current.value, postImageUpload);
            }}
            className="post-btn"
          >
            Whisper
          </button>
        </div>
        <Emoji>
          <Picker
            data={data}
            onEmojiSelect={(emoji) =>
              setValue((prevValue) => prevValue + emoji.native)
            }
          ></Picker>
        </Emoji>
      </div>
    </div>
  );
};
