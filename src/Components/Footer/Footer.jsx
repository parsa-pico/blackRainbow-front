import { Link, Typography } from "@mui/material";
import React from "react";
import TelegramIcon from "@mui/icons-material/Telegram";
import InstagramIcon from "@mui/icons-material/Instagram";
import CallIcon from "@mui/icons-material/Call";
export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <Typography gutterBottom fontFamily="titr" color="white" variant="h6">
        بلک رینبو
      </Typography>
      <p className="footer-text">
        فروشگاه بلک رینبو یکی از قدیمی ترین فروشگاه ها در حوزه گاثیک و اکسسوری
        با بیش از 7 سال سابقه فعالیت می باشد.
      </p>

      <Typography
        className="mt-2"
        gutterBottom
        fontFamily="titr"
        color="white"
        variant="h6"
      >
        شبکه های اجتماعی ما
      </Typography>
      <p>
        <TelegramIcon />
        <Link
          target="_blank"
          href="https://t.me/Black_Rainbow_shop"
          underline="none"
          className="me-2"
          rel="noopener"
        >
          تلگرام
        </Link>
      </p>
      <p>
        <InstagramIcon />
        <Link
          href="https://www.instagram.com/black_rainbow_shop"
          underline="none"
          className="me-2"
          rel="noopener"
        >
          اینستاگرام
        </Link>
      </p>
      <Typography
        className="mt-2"
        gutterBottom
        fontFamily="titr"
        color="white"
        variant="h6"
      >
        ارتباط با ما
      </Typography>
      <p>
        <CallIcon />
        <Link href="tel:09940881094" underline="none" className="me-2">
          09940881094
        </Link>
      </p>
    </footer>
  );
}
