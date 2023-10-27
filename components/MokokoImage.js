import React from "react";
import { useMediaQuery } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import mokokoImage from "@/app/res/mokoko.png";

const style = makeStyles({
  image: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "656px",
    height: "520px",
  },
  mobileImage: {
    width: "492px",
    height: "390px",
  },
});

const MokokoImage = ({}) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const classes = style();
  return (
    <img
      className={`${classes.image} ${isMobile && classes.mobileImage}`}
      src={mokokoImage.src}
      alt="mokoko"
    />
  );
};

export default MokokoImage;
