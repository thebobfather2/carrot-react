import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../images/bunnyhead.png";
import twtr from "./img/twitter.png";
import youtube from "./img/youtube.png";
import magiceden from "../images/MELogo.png";
import "./Navbar2.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [dropdown2, setDropdown2] = useState(false);
  const [dropdown3, setDropdown3] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const onMouseEnterTools = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(true);
    }
  };

  const onMouseLeaveTools = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(false);
    }
  };
  const onMouseEnterUtils = () => {
    if (window.innerWidth < 960) {
      setDropdown2(false);
    } else {
      setDropdown2(true);
    }
  };

  const onMouseLeaveUtils = () => {
    if (window.innerWidth < 960) {
      setDropdown2(false);
    } else {
      setDropdown2(false);
    }
  };
  const onMouseEnterPartners = () => {
    if (window.innerWidth < 960) {
      setDropdown3(false);
    } else {
      setDropdown3(true);
    }
  };

  const onMouseLeavePartners = () => {
    if (window.innerWidth < 960) {
      setDropdown3(false);
    } else {
      setDropdown3(false);
    }
  };

  return (
    <>
      <nav className="navbar">

      <a href="https://www.bobbyrabbits.com/" className="navbar-logo" onClick={closeMobileMenu}>
          <img src={Logo} className="Nav-Logo" />
          <i class="fab fa-firstdraft" />
        </a>

        <a href="https://twitter.com/bobbyrabbits" className="navbar-logo" onClick={closeMobileMenu}>
          <img src={twtr} className="Nav-Logo" />
          <i class="fab fa-firstdraft" />
        </a>

        <a href="https://www.youtube.com/c/BobbyRabbitsNFT" className="navbar-logo" onClick={closeMobileMenu}>
          <img src={youtube} className="Nav-Logo" />
          <i class="fab fa-firstdraft" />
        </a>

        <a href="https://magiceden.io/creators/bobbyrabbits/" className="navbar-logo" onClick={closeMobileMenu}>
          <img src={magiceden} className="Nav-Logo" />
          <i class="fab fa-firstdraft" />
        </a>

        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? "fas fa-times" : "fas fa-bars"} />
        </div>
        <ul className={click ? "nav-menu active" : "nav-menu"}>


        </ul>
        <WalletMultiButton/>
      </nav>
    </>
  );
}

export default Navbar;
