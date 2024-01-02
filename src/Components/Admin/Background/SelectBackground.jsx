import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getOrientation } from "get-orientation/browser";
import {
  getCroppedImg,
  getRotatedImage,
} from "../Item/SelectPictures/canvasUtils";
import { Dialog, Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InputFileUpload from "../../../Common/commonComponents";
import { readFile, tryHTTP } from "../../../Common/commonFuncs";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect } from "react";
const ORIENTATION_TO_ANGLE = {
  3: 180,
  6: 90,
  8: -90,
};

const SelectBackground = () => {
  const [picture, setPicture] = useState({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = React.useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [fileName, setFileName] = useState("");
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const sendImage = async () => {
    try {
      setLoading(true);
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      await tryHTTP(async (http) => {
        const response = await fetch(croppedImage);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append("picture", blob, fileName);

        const { data } = await http.post("/pictures/background", formData);
        const uploadedFileName = data.fileName;
        setPicture({ blob: croppedImage, uploadedFileName });
        toast("عکس آپلود شد");
        window.location = "/";
      });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    setImageSrc(null);
    setOpen(false);
  };

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);

      // try {
      //   // apply rotation if needed
      //   const orientation = await getOrientation(file);
      //   const rotation = ORIENTATION_TO_ANGLE[orientation];
      //   if (rotation) {
      //     imageDataUrl = await getRotatedImage(imageDataUrl, rotation);
      //   }
      // } catch (e) {
      //   console.warn("failed to detect the orientation");
      // }
      setFileName(file.name);
      setImageSrc(imageDataUrl);
    }
  };
  function handleClose() {
    console.log("hi");
    setLoading(false);
    setImageSrc(null);
    setOpen(false);
  }
  useEffect(() => {
    const nav = document.getElementById("my-nav");
    if (imageSrc) nav.style.display = "none";
    else nav.style.display = "block";
  }, [imageSrc]);
  return (
    <div>
      <h5>آپلود پس زمینه </h5>
      <small>حتما jpg باشد</small>
      {imageSrc ? (
        <React.Fragment>
          <Dialog
            PaperProps={{
              style: {
                backgroundColor: "transparent",
                boxShadow: "none",
              },
            }}
            scroll="body"
            fullScreen
            open={imageSrc ? true : false}
            onClose={handleClose}
          >
            <div>
              <Cropper
                image={imageSrc}
                crop={crop}
                // rotation={rotation}
                zoom={zoom}
                aspect={1 / 1}
                onCropChange={(e) => {
                  if (!loading) {
                    setCrop(e);
                  }
                }}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div>
              <div>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                  style={{ position: "relative", right: "2%" }}
                >
                  <CloseIcon />
                </IconButton>
              </div>
              <LoadingButton
                loading={loading}
                onClick={sendImage}
                variant="contained"
                color="primary"
              >
                <span>ثبت</span>
              </LoadingButton>
            </div>
          </Dialog>
        </React.Fragment>
      ) : (
        <InputFileUpload
          label="آپلود پس زمینه سایت"
          className="my-3"
          onChange={onFileChange}
          accept="image/*"
        />
      )}
      <Grid maxWidth="50%" container spacing={1}>
        {picture.uploadedFileName && (
          <Grid className="relative" item xs={6}>
            <img className="img-fluid" src={picture.blob} />
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default SelectBackground;
