import { Button } from "@material-ui/core";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../images/bunnyhead.png";
import youtube from "./img/youtube.png";
import twitter from "./img/twitter.png";
import magiceden from "../images/MELogo.png";
import "./Navbar.css";

const Navbar = () => {
  let walletAddress = "";
  const wallet = useAnchorWallet();
  walletAddress = wallet?.publicKey.toString();
  const [toggleMenu, setToggleMenu] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const toggleNav = () => {
    setToggleMenu(!toggleMenu);
  };

  useEffect(() => {
    const changeWidth = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", changeWidth);
    return () => {
      window.removeEventListener("resize", changeWidth);
    };
  }, []);

  return (
    <nav>
      {toggleMenu || screenWidth > 755 ? (
        <>
          <Link to="/">
            <img className="navlogo" src={Logo} alt="logo"/>
          </Link>
          <ul className="list"close>
            <br></br>
            <br></br>



         

        <a href="https://magiceden.io/creators/bobbyrabbits/" className="navbar-logo2" onClick={toggleNav}>
          <img src={magiceden} className="nav-logo" />
          <i class="fab fa-firstdraft" />
        </a>

        <a href="https://www.youtube.com/c/BobbyRabbitsNFT" className="navbar-logo2" onClick={toggleNav}>
          <img src={youtube} className="nav-logo" />
          <i class="fab fa-firstdraft" />
        </a>

        <a href="https://twitter.com/bobbyrabbits" className="navbar-logo2" onClick={toggleNav}>
          <img src={twitter} className="nav-logo" />
          <i class="fab fa-firstdraft" />
        </a>

        <br></br>

            <WalletModalProvider>
              <li>
                <WalletMultiButton
                  style={{ backgroundColor: "black !important" }}
                />
              </li>
            </WalletModalProvider>
          </ul>
          <Button className="close" onClick={toggleNav} style={{marginTop: "25px"}}>
            Close
          </Button>
        </>
      ) : (
        <nav className="nav">
          
        <Link to="/" className="navbar-logo">
          <img src={Logo} className="navLogo"/>
        </Link>

        <button onClick={toggleNav} className="btn" style={{ marginTop: "22px", color: "white" }}>
          Menu
        </button>
        </nav>
      )}
    </nav>
  );
};

export default Navbar;
