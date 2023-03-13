import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import Cropper from "react-easy-crop";

export const ImageCrop = ({ image, cropInit, zoomInit, aspectInit }) => {
  if (cropInit == null) {
    cropInit = { x: 0, y: 0 };
  }
  if (zoomInit == null) {
    zoomInit = 1;
  }
  if (aspectInit == null) {
    aspectInit = 4 / 3;
  }
  const [crop, setCrop] = useState(cropInit);
  const [zoom, setZoom] = useState(zoomInit);
  const [aspect, setAspect] = useState(aspectInit);
  const Wrapper = styled.div`
    position: relative;
  `;
  return (
    <Wrapper>
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        onCropChange={setCrop}
        onZoomChange={setZoom}
      ></Cropper>
      <input type={"range"}></input>
    </Wrapper>
  );
};
