import React from "react";
import { Link } from "react-router-dom";
import vsn from "../images/vsn.png";
import apply from "../images/apply.png";
import "./VSNHome.css";
import { borderRadius } from "@mui/system";

const VSNHome = () => {
  const partners = [
    {
      name: "VSN Radio",
      image: vsn,
      path: "/VSNRadio",
    },
    {
      name: "Marketplace",
      image: vsn,
      path: "/Marketplace",
    },
    {
      name: "Dashboard",
      image: vsn,
      path: "/Dashboard",
    },

  ];
  return (
    <div className="partnersMain" style={{marginTop: "20px"}}>

  <h1 className="Title">Welcome To VSN</h1>

      <div className="TextBox">
        
        <h3 className="subTitle" style={{marginBottom: "30px"}}>What is Vibe Stream Network?</h3>
      
          <h4>Vibe Stream Network is more than a music marketplace... it's a music RIGHTS marketplace! Every master listed on our marketplace will be broken down into 100 NFTs - each NFT represents 1% ownership in the track.
          Simple, right? Now imagine - every dollar earned, from Spotify streaming revenue to a fat check for licensing the song to a tv show or commercial, will be divided by 100 and airdropped straight to the owners. 
          Our proprietary technology will use the security of blockchain verification to air drop proportionally to owners in an instant. No more vague contracts, no more waiting on "business days" to receive a direct deposit. Owning 5 NFTs of
          a single track means you own 5%, and will get 5% of every dollar of profit dropped straight into your wallet. This is how we plan to change the music business with Web3.</h4>
        
        </div>  

  <div className="Explore">

  <h3 className="subTitle2" style={{marginBottom: "30px"}}>Explore VSN</h3>

      <div className="partnerContainer">
        {partners.map((partner) => {
          return (
            <Link to={partner.path}>
              <div
                style={{
                  backgroundColor: partner.primaryColor,
                  borderRadius: "10px",
                }}
                className="partnerCard"
              >
                <img
                className="partnerimg"
                  src={partner.image}
                  style={{ maxWidth: "350px" }}
                  alt="partner logo"
                />
                <h3 style={{ color: "white", marginTop: "10px" }}>{partner.name}</h3>
              </div>
            </Link>
          );
        })}
      </div>
  </div>
      <div className="MissionBox">
        
      <h3 className="subTitle3">Our Mission</h3>

        <div className="MissionStatement">
      
          VSN is in the business of community-owned entertainment. We address the lack of
          opportunities and accessibilities for both users and creators by utilizing blockchain
          technology to innovate new financial systems, using technology to bridge the gap.
         
          <br></br>

          <h4 style={{marginTop: "30px"}}>-The VSN Team</h4>
        </div>
      </div>

    </div>

    
  );
};

export default VSNHome;
