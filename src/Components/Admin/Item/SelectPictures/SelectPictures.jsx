import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getOrientation } from "get-orientation/browser";
import { getCroppedImg, getRotatedImage } from "./canvasUtils";
import { Dialog, Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InputFileUpload from "../../../../Common/commonComponents";
import { tryHTTP } from "../../../../Common/commonFuncs";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";
const ORIENTATION_TO_ANGLE = {
  3: 180,
  6: 90,
  8: -90,
};

const SelectPictures = ({ pictures, setPictures, label }) => {
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

        const { data } = await http.post("/pictures", formData);
        const uploadedFileName = data.fileName;
        setPictures((i) => [...i, { blob: croppedImage, uploadedFileName }]);
        toast("عکس آپلود شد");
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
  return (
    <div>
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
          label={label}
          className="my-3"
          onChange={onFileChange}
          accept="image/*"
        />
      )}
      <Grid maxWidth="50%" container spacing={1}>
        {pictures &&
          pictures.length > 0 &&
          pictures.map((imgObj, i) => {
            return (
              <Grid key={i} className="relative" item xs={6}>
                <IconButton
                  onClick={() => {
                    tryHTTP(async (http) => {
                      await http.delete(`/pictures/${imgObj.uploadedFileName}`);
                      const copy = [...pictures];
                      copy.splice(i, 1);
                      setPictures(copy);
                    });
                  }}
                  className="absolute bg-dark"
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
                <img className="img-fluid" src={imgObj.blob} />
              </Grid>
            );
          })}
      </Grid>
    </div>
  );
};

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

export default SelectPictures;
