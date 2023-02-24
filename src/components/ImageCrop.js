import React, { useState } from "react";
import Cropper from "react-easy-crop";

export const ImageCrop = () => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  return <Cropper></Cropper>;
};
