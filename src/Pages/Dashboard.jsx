import { Button, Paper } from "@material-ui/core";
import { CircularProgress } from "@mui/material";
import { useWalletNfts } from "@nfteyez/sol-rayz-react";
import * as spltoken from "@solana/spl-token";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Connection } from "@solana/web3.js";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AlphaNFTs from "src/components/AlphaNFTs";
import hashlist from "../filter.json";
import icyhash from "../IcyHashlist.json";
import closeModal from "../images/closeIcon.png";
import coin from "../images/icons/coin.png";
import galleryIcon from "../images/icons/gallery.png";
import walletIcon from "../images/icons/wallet.png";
import fpStats from "../Stats/fp.json";
import icyFpStats from "../Stats/icyFP.json";
import icyVolStats from "../Stats/icyVol.json";
import volStats from "../Stats/volume.json";
import "./Dashboard.css";

const Dashboard = () => {
  //initialize walletAddress variable
  let walletAddress = "";
  const connection = new Connection(
    "https://solana-api.projectserum.com/",
    "confirmed"
  );

  //create array from hashlist
  const tokens = JSON.stringify(hashlist);
  const newTokens = JSON.parse(tokens);

  //set
  const wallet = useAnchorWallet();
  walletAddress = wallet?.publicKey.toString();
  const [isLoading, setIsLoading] = useState(false);
  const [isSolPrice, setIsSolPrice] = useState(false);

  //get nfts metadata as an array
  const { nfts } = useWalletNfts({
    publicAddress: walletAddress,
    sort: true,
  });

  const getMints = JSON.stringify(nfts);

  var arr = [];
  try {
    arr = JSON.parse(getMints).reduce((acc, val) => [...acc, val.mint], []);
  } catch (e) {
    console.log("Invalid json");
  }

  const checkTokens = newTokens.some((r) => arr.indexOf(r) >= 0);

  //Dashboard
  //import ICY Hashlist
  const Icy = JSON.stringify(icyhash);
  const IcyTokens = JSON.parse(Icy);

  //fetchMetadata to display image field
  const [metadata, setMetadata] = useState({});

  // we need to fetch the metadata seperately from the NFTs data.uri field
  const fetchMetadata = useCallback(async () => {
    for (const nft of nfts) {
      try {
        fetch(nft.data.uri)
          .then((response) => response.json())
          .then((meta) =>
            setMetadata((state) => ({ ...state, [nft.mint]: meta }))
          );
      } catch (error) {
        console.log(error);
      }
    }
  }, [nfts]);

  useEffect(() => {
    if (nfts?.length) fetchMetadata();
  }, [nfts, fetchMetadata]);

  //filter for OG only
  const OGallowed = newTokens;

  const OGfiltered = Object.keys(metadata)
    .filter((key) => OGallowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = metadata[key];
      return obj;
    }, {});

  //filet for icy only
  const Icyallowed = IcyTokens;

  const Icyfiltered = Object.keys(metadata)
    .filter((key) => Icyallowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = metadata[key];
      return obj;
    }, {});

  const OGoutput = newTokens.filter(function (obj) {
    return arr.indexOf(obj) !== -1;
  });

  //compare the ICY and Wallet arrays for a counter
  const ICYoutput = IcyTokens.filter(function (obj) {
    return arr.indexOf(obj) !== -1;
  });

  //Compare og hash and wallet for new array
  let walletOG = newTokens.filter((e) => arr.indexOf(e) !== -1);

  //Compare ICY hash and wallet for new array
  let walletICY = IcyTokens.filter((e) => arr.indexOf(e) !== -1);

  //set price and update it
  let [price, setPrice] = useState("");

  //get the price of solana
  async function fetchPrice() {
    await axios
      .get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=solana`
      )
      .then((response) => {
        let SolanaAPI = JSON.stringify(response.data);
        let price = JSON.parse(SolanaAPI).reduce(
          (acc, val) => [...acc, val.current_price],
          []
        );
        setPrice(price);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    fetchPrice();
  }, []);

  //fetch carot wallet
  const solanaWeb3 = require("@solana/web3.js");
  const public_key = new solanaWeb3.PublicKey(
    "5BNK4Kq1b5rDcr3fkqhfJLz58XEfcT3sPJdxLAB6n7Cq"
  );
  const [carot, setCarot] = useState("");

  async function fetchCarot() {
    const connection = new solanaWeb3.Connection(
      solanaWeb3.clusterApiUrl("mainnet-beta"),
      "confirmed"
    );
    if (public_key !== null) {
      const balance = await connection.getBalance(public_key);
      setCarot(balance / 1000000000);
    }
  }
  useEffect(() => {
    fetchCarot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //fetch community wallet
  const compublic_key = new solanaWeb3.PublicKey(
    "Hp59SRG9HfKQJ8MGJjRVdi7dqtHRFYsfvgJtJknc9Dhv"
  );
  const [community, setCommunity] = useState("");

  async function fetchCommunity() {
    const connection = new solanaWeb3.Connection(
      solanaWeb3.clusterApiUrl("mainnet-beta"),
      "confirmed"
    );
    if (compublic_key !== null) {
      const balance = await connection.getBalance(compublic_key);
      //console.log(balance)
      setCommunity(balance / 1000000000);
    }
  }
  useEffect(() => {
    fetchCommunity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //fetch alpha wallet
  const alphapublic_key = new solanaWeb3.PublicKey(
    "AhU6zW8Ef4ptmAK7Dq3NGgpciVEGAUTbFMU1YeCAgRxa"
  );
  const [alpha, setAlpha] = useState("");

  async function fetchAlpha() {
    const connection = new solanaWeb3.Connection(
      solanaWeb3.clusterApiUrl("mainnet-beta"),
      "confirmed"
    );
    if (alphapublic_key !== null) {
      const balance = await connection.getBalance(alphapublic_key);
      setAlpha(balance / 1000000000);
    }
  }
  useEffect(() => {
    fetchAlpha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Magic Eden Stats OG
  const [fp, setFP] = useState("");
  const [volume, setVolume] = useState("");
  const [listed, setListed] = useState("");

  var config = {
    method: "get",
    url: "https://pacific-island-08902.herokuapp.com/https://api-mainnet.magiceden.dev/v2/collections/bobbyrabbits/stats",
    headers: {},
  };
  axios(config)
    .then(function (response) {
      setFP(response.data.floorPrice / 1000000000);
      setVolume(response.data.volumeAll / 1000000000);
      setListed(response.data.listedCount);
    })
    .catch(function (error) {
      console.log(error);
    });

  //Magic Eden Stats icy
  const [icyFp, setIcyFp] = useState("");
  const [icyVolume, setIcyVolume] = useState("");
  const [icyListed, setIcyListed] = useState("");

  var config = {
    method: "get",
    url: "https://pacific-island-08902.herokuapp.com/https://api-mainnet.magiceden.dev/v2/collections/icyrabbits/stats",
    headers: {},
  };
  axios(config)
    .then(function (response) {
      setIcyFp(response.data.floorPrice / 1000000000);
      setIcyVolume(response.data.volumeAll / 1000000000);
      setIcyListed(response.data.listedCount);
    })
    .catch(function (error) {
      console.log(error);
    });
  while (fp === null) {
    setIsLoading(true);
  }
  const [isOGRabbits, setIsOGRabbits] = useState(false);

  const showOGRabbits = () => {
    setIsOGRabbits(true);
  };

  const hideOGRabbits = () => {
    setIsOGRabbits(false);
  };

  const filterArray = Object.keys(metadata)
    .filter((key) => newTokens.includes(key))
    .reduce((obj, key) => {
      obj[key] = metadata[key];
      return obj;
    }, {});

  var result = Object.keys(filterArray).map((key) => [key, filterArray[key]]);

  const [isIcyRabbits, setIsIcyRabbits] = useState(false);

  const showIcyRabbits = () => {
    setIsIcyRabbits(true);
  };

  const hideIcyRabbits = () => {
    setIsIcyRabbits(false);
  };

  const icyFilteredArray = Object.keys(metadata)
    .filter((key) => IcyTokens.includes(key))
    .reduce((obj, key) => {
      obj[key] = metadata[key];
      return obj;
    }, {});

  var icyResult = Object.keys(icyFilteredArray).map((key) => [
    key,
    icyFilteredArray[key],
  ]);
  const [priceHistory, setPriceHistory] = useState([]);

  //solana price history
  async function fetchPriceHistory() {
    await axios
      .get(
        `https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=30&interval=hourly`
      )
      .then((response) => {
        let solanaPriceHistory = JSON.parse(JSON.stringify(response.data));
        setPriceHistory(solanaPriceHistory.prices);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    fetchPriceHistory();
  }, []);

  let newObj = [];

  priceHistory.forEach((item) => {
    const theDate = new Date(item[0]);
    newObj.push({
      date:
        theDate.getMonth() +
        1 +
        "/" +
        theDate.getDate() +
        "/" +
        theDate.getFullYear(),
      price: parseFloat(item[1]).toFixed(2),
    });
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active) {
      return (
        <div className="custom-tooltip">
          <p className="lablel">{`${payload[0].payload.date}`}</p>
          <p className="label">{`${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const solToggle = () => {
    setIsSolPrice(!isSolPrice);
    setIsCommunity(false);
    setIsCarot(false);
    setIsAlpha(false);
    setIsOGVol(false);
    setIsOGFp(false);
    setIsIcyVol(false);
    setIsIcyFp(false);
  };

  //community wallet transfers
  const [isCommunity, setIsCommunity] = useState(false);
  const [comTransfers, setComTransfers] = useState([]);
  const { isCommunityLoading, setIsCommunityLoading } = useState(true);

  const setCommunityState = () => {
    setIsCommunity(!isCommunity);
    setIsSolPrice(false);
    setIsCarot(false);
    setIsAlpha(false);
    setIsOGVol(false);
    setIsOGFp(false);
    setIsIcyVol(false);
    setIsIcyFp(false);
  };

  const getCommunityTransfers = useCallback(async () => {
    await axios
      .get(
        `https://public-api.solscan.io/account/solTransfers?account=Hp59SRG9HfKQJ8MGJjRVdi7dqtHRFYsfvgJtJknc9Dhv&offset=0&limit=10
        `
      )
      .then((response) => {
        let apiRequest = JSON.parse(JSON.stringify(response.data.data));
        setComTransfers(apiRequest);
      })
      .catch((error) => {
        console.log(error);
      });
  });
  useEffect(() => {
    getCommunityTransfers();
  }, []);

  //Carot wallet transfers
  const [isCarot, setIsCarot] = useState(false);
  const [carotTransfers, setCarotTransfers] = useState([]);

  const setCarotState = () => {
    setIsCarot(!isCarot);
    setIsSolPrice(false);
    setIsCommunity(false);
    setIsAlpha(false);
    setIsOGVol(false);
    setIsOGFp(false);
    setIsIcyVol(false);
    setIsIcyFp(false);
  };

  const getCarotTransfers = useCallback(async () => {
    await axios
      .get(
        `https://public-api.solscan.io/account/solTransfers?account=5BNK4Kq1b5rDcr3fkqhfJLz58XEfcT3sPJdxLAB6n7Cq&offset=0&limit=10
        `
      )
      .then((response) => {
        let apiRequest = JSON.parse(JSON.stringify(response.data.data));
        setCarotTransfers(apiRequest);
      })
      .catch((error) => {
        console.log(error);
      });
  });
  useEffect(() => {
    getCarotTransfers();
  }, []);

  //Alpha wallet transfers
  const [isAlpha, setIsAlpha] = useState(false);
  const [alphaTransfers, setAlphaTransfers] = useState([]);

  const setAlphaState = () => {
    setIsAlpha(!isAlpha);
    setIsCarot(false);
    setIsSolPrice(false);
    setIsCommunity(false);
    setIsOGVol(false);
    setIsOGFp(false);
    setIsIcyVol(false);
    setIsIcyFp(false);
  };

  const getAlphaTransfers = useCallback(async () => {
    await axios
      .get(
        `https://public-api.solscan.io/account/solTransfers?account=AhU6zW8Ef4ptmAK7Dq3NGgpciVEGAUTbFMU1YeCAgRxa&offset=0&limit=10
        `
      )
      .then((response) => {
        let apiRequest = JSON.parse(JSON.stringify(response.data.data));
        setAlphaTransfers(apiRequest);
      })
      .catch((error) => {
        console.log(error);
      });
  });
  useEffect(() => {
    getAlphaTransfers();
  }, []);

  const [isAlphaHoldings, setIsAlphaHoldings] = useState(false);
  const showAlphaHoldings = () => {
    setIsAlphaHoldings(true);
  };
  const hideAlphaHoldings = () => {
    setIsAlphaHoldings(false);
  };

  const [isOGFp, setIsOGFp] = useState(false);
  const [isOGVol, setIsOGVol] = useState(false);
  const [isIcyFp, setIsIcyFp] = useState(false);
  const [isIcyVol, setIsIcyVol] = useState(false);

  const setOGFpState = () => {
    setIsOGFp(!isOGFp);
    setIsOGVol(false);
    setIsAlpha(false);
    setIsCarot(false);
    setIsSolPrice(false);
    setIsCommunity(false);
    setIsIcyVol(false);
    setIsIcyFp(false);
  };

  const setOGVolState = () => {
    setIsOGVol(!isOGVol);
    setIsOGFp(false);
    setIsAlpha(false);
    setIsCarot(false);
    setIsSolPrice(false);
    setIsCommunity(false);
    setIsIcyVol(false);
    setIsIcyFp(false);
  };

  const setIcyFpState = () => {
    setIsIcyFp(!isIcyFp);
    setIsIcyVol(false);
    setIsOGFp(false);
    setIsOGVol(false);
    setIsAlpha(false);
    setIsCarot(false);
    setIsSolPrice(false);
    setIsCommunity(false);
  };

  const setIcyVolState = () => {
    setIsIcyVol(!isIcyVol);
    setIsIcyFp(false);
    setIsOGVol(false);
    setIsOGFp(false);
    setIsAlpha(false);
    setIsCarot(false);
    setIsSolPrice(false);
    setIsCommunity(false);
  };

  if (wallet && checkTokens) {
    return (
      <>
        {isOGRabbits && (
          <div className="rabbitsDisplay">
            <div className="miniGallery">
              <h3 style={{ position: "absolute", top: "5px", left: "20px" }}>
                VSN Passes
              </h3>
              <img
                className="closeModal"
                src={closeModal}
                alt="close modal"
                onClick={hideOGRabbits}
              />
              {result.map((nft, index) => {
                return (
                  <Paper className="images" elevation={8}>
                    <img
                      src={nft[1].image}
                      className="BobbyRabbits"
                      alt="rabbits"
                    />
                  </Paper>
                );
              })}
            </div>
          </div>
        )}
        <div className="DashboardMain">
          <div className="DashboardMainContainer">
            <h1 className="DashboardTitle">VSN Dashboard</h1>
            <div className="DashboardTop">
              <div className="DashboardTopLeft">
                <div className="RabbitHouse">
                  <h3 className="MyRabbitsText"> Almond Butter Payout</h3>
                  <Button className="showRabbits" onClick={showIcyRabbits}>
                    Pay Holders
                  </Button>
                </div>
                <div className="RabbitHouse">
                  <h3 className="MyRabbitsText"> Fourth Dimensional Payout</h3>
                  <Button className="showRabbits" onClick={showAlphaHoldings}>
                    Pay Holders
                  </Button>
                </div>
                <div className="RabbitHouse">
                  <h3 className="MyRabbitsText"> Under The Sun Payout</h3>
                  <Button className="showRabbits" onClick={showOGRabbits}>
                    Pay Holders
                  </Button>
                </div>
                <div className="RabbitHouse">
                  <h3 className="MyRabbitsText"> VSN Passes</h3>
                  <Button className="showRabbits" onClick={showOGRabbits}>
                    Show VSN Passes
                  </Button>
                </div>
              </div>
              <div className="RightSideTop">
                <div className="Wallets">
                  <div className="walletsIcon">
                    <div className="hoverText">
                      Click Icon to view recent Transfers
                    </div>
                    <img
                      className="walletsIconImage"
                      src={walletIcon}
                      alt="wallet icon"
                      onClick={setCommunityState}
                    ></img>
                  </div>
                  <div className="walletInfo">
                    <h3 className="walletAddress">Almond Butter Wallet:</h3>
                    <div className="walletprices">
                      <h3 className="walletBalance">
                        {parseFloat(community).toFixed(2)} SOL
                      </h3>
                      <h5 className="walletUSD">
                        ({" "}
                        {(community * price).toLocaleString("en-us", {
                          style: "currency",
                          currency: "USD",
                        })}{" "}
                        USD )
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="Wallets">
                  <div className="walletsIcon">
                    <div className="hoverText">
                      Click Icon to view recent Transfers
                    </div>
                    <img
                      className="walletsIconImage"
                      src={walletIcon}
                      alt="wallet icon"
                      onClick={setCarotState}
                    ></img>
                  </div>
                  <div className="walletInfo">
                    <h3 className="walletAddress">Fourth Dimensional Thinking Wallet:</h3>
                    <div className="walletprices">
                      <h3 className="walletBalance">
                        {parseFloat(carot).toFixed(2)} SOL
                      </h3>
                      <h5 className="walletUSD">
                        ({" "}
                        {(carot * price).toLocaleString("en-us", {
                          style: "currency",
                          currency: "USD",
                        })}{" "}
                        USD )
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="Wallets">
                  <div className="walletsIcon">
                    <div className="hoverText">
                      Click Icon to view recent Transfers
                    </div>
                    <img
                      className="walletsIconImage"
                      src={walletIcon}
                      alt="wallet icon"
                      onClick={setAlphaState}
                    ></img>
                  </div>
                  <div className="walletInfo">
                    <h3 className="walletAddress">Under The Sun Wallet:</h3>
                    <div className="walletprices">
                      <h3 className="walletBalance">
                        {parseFloat(alpha).toFixed(2)} SOL
                      </h3>
                      <h5 className="walletUSD">
                        ({" "}
                        {(alpha * price).toLocaleString("en-us", {
                          style: "currency",
                          currency: "USD",
                        })}{" "}
                        USD )
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br></br>
            <div className="pricesContainer">
              <div className="coins">
                <div className="walletsIcon">
                  <img className="walletsIconImage" src={coin} alt="coin"></img>
                </div>
                <div className="coinInfo">
                  <h3 className="coinAddress">$ALMO Price:</h3>
                  <h3 className="SolPrice"> $0.006 USD </h3>
                </div>
              </div>
              <div className="coins">
                <div className="walletsIcon">
                  <img className="walletsIconImage" src={coin} alt="coin"></img>
                </div>
                <div className="coinInfo">
                  <h3 className="coinAddress">$FOUR Price:</h3>
                  <h3 className="SolPrice"> $0.00 USD </h3>
                </div>
              </div>

              <div className="coins">
                <div className="walletsIcon">
                  <img className="walletsIconImage" src={coin} alt="coin"></img>
                </div>
                <div className="coinInfo">
                  <h3 className="coinAddress">$UNDE Price:</h3>
                  <h3 className="SolPrice"> $0.00 USD </h3>
                </div>
              </div>
              <div className="coins">
                <div className="walletsIcon">
                  <div className="hoverText">
                    Click Icon to view VSN Pass FP Graph
                  </div>
                  <img
                    className="walletsIconImage"
                    src={galleryIcon}
                    alt="coin"
                    onClick={setOGFpState}
                  ></img>
                </div>
                <div className="coinInfo">
                  <h3 className="coinAddress">VSN Pass FP:</h3>
                  <h3 className="SolPrice">{parseFloat(fp).toFixed(2)} SOL </h3>
                </div>
              </div>
              <div className="coins">
                <div className="walletsIcon">
                  <div className="hoverText">
                    Click Icon to view VSN Pass Volume Graph
                  </div>
                  <img
                    className="walletsIconImage"
                    src={galleryIcon}
                    alt="coin"
                    onClick={setOGVolState}
                  ></img>
                </div>
                <div className="coinInfo">
                  <h3 className="coinAddress">VSN Pass Vol:</h3>
                  <h3 className="SolPrice">
                    {" "}
                    {parseFloat(volume).toFixed(2)} SOL
                  </h3>
                </div>
              </div>
              <div className="coins">
                <div className="walletsIcon">
                  <img
                    className="walletsIconImage"
                    src={galleryIcon}
                    alt="coin"
                  ></img>
                </div>
                <div className="coinInfo">
                  <h3 className="coinAddress">Passes Listed:</h3>
                  <h3 className="SolPrice"> {listed} </h3>
                </div>
              </div>
            </div>
            <div className="DashboardBottom">
              <div className="charts">
                {isSolPrice && (
                  <>
                    <div className="chart">
                      <h4 className="chartname">SOL Price</h4>
                      <ResponsiveContainer width={"99%"} height="99%">
                        <AreaChart
                          data={newObj}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <XAxis dataKey="date" stroke="white"></XAxis>
                          <YAxis stroke="white" domain={[25, 45]}></YAxis>
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke="black"
                            fill="black"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}
                {isOGFp && (
                  <>
                    <div className="chart">
                      <h4 className="chartname">VSN Pass FP</h4>
                      <ResponsiveContainer width="99%" height="99%">
                        <AreaChart
                          width={1500}
                          height={300}
                          data={fpStats}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <XAxis dataKey="date" stroke="white"></XAxis>
                          <YAxis stroke="white" domain={[0, 2.5]}></YAxis>
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="fp"
                            stroke="black"
                            fill="black"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}
                {isOGVol && (
                  <>
                    <div className="chart">
                      <h4 className="chartname">VSN Pass Volume</h4>
                      <ResponsiveContainer width="99%" height="99%">
                        <AreaChart
                          width={1500}
                          height={300}
                          data={volStats}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <XAxis dataKey="date" stroke="white"></XAxis>
                          <YAxis stroke="white" domain={[0, 40]}></YAxis>
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="vol"
                            stroke="black"
                            fill="black"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}
                {isIcyFp && (
                  <>
                    <div className="chart">
                      <h4 className="chartname">Icy FP</h4>
                      <ResponsiveContainer width="99%" height="99%">
                        <AreaChart
                          width={1500}
                          height={300}
                          data={icyFpStats}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <XAxis dataKey="date" stroke="white"></XAxis>
                          <YAxis stroke="white" domain={[0, 5]}></YAxis>
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="fp"
                            stroke="black"
                            fill="black"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}
                {isIcyVol && (
                  <>
                    <div className="chart">
                      <h4 className="chartname">Icy Volume</h4>
                      <ResponsiveContainer width="99%" height="99%">
                        <AreaChart
                          width={1500}
                          height={300}
                          data={icyVolStats}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <XAxis dataKey="date" stroke="white"></XAxis>
                          <YAxis stroke="white" domain={[0, 5]}></YAxis>
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="vol"
                            stroke="black"
                            fill="black"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}
                {isCommunity && (
                  <>
                    <div className="Table">
                      <h4 className="chartname">
                        Community Wallet Sol Transfers
                      </h4>
                      <div className="TableHeadings">
                        <h5 className="headings">Tx Hash</h5>
                        <h5 className="hidden">hidden text</h5>
                        <h5 className="hidden">hidd</h5>
                        <h5 className="headings">Sender</h5>
                        <h5 className="hidden">hidden text</h5>
                        <h5 className="hidden">hidden </h5>
                        <h5 className="headings">Recipient</h5>
                        <h5 className="hidden">hidden text</h5>
                        <h5 className="hidden">hidden te</h5>
                        <h5 className="headings">Date and Time</h5>
                        <h5 className="hidden">hidden text</h5>
                        <h5 className="hidden">hidd</h5>
                        <h5 className="headings">Sol</h5>
                      </div>
                      <div className="Divider"></div>
                      {comTransfers.map((transfer) => {
                        return (
                          <div className="Transfers">
                            <a
                              className="links"
                              href={"https://solscan.io/tx/" + transfer.txHash}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <h5 className="headings">{transfer.txHash}</h5>
                            </a>
                            <a
                              className="links"
                              href={
                                "https://solscan.io/account/" + transfer.src
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              <h5 className="headings">{transfer.src}</h5>
                            </a>
                            <a
                              className="links"
                              href={
                                "https://solscan.io/account/" + transfer.dst
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              <h5 className="headings">{transfer.dst}</h5>
                            </a>
                            <h5 className="headings">
                              {new Date(
                                transfer.blockTime * 1000
                              ).toLocaleDateString()}
                            </h5>
                            <h5 className="headings">
                              {transfer.lamport / 1000000000}
                            </h5>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                {isCarot && (
                  <>
                    <div className="Table">
                      <h4 className="chartname">Carot Wallet Sol Transfers</h4>
                      <div className="TableHeadings">
                        <h5 className="headings">Tx Hash</h5>
                        <h5 className="hidden">hidden text</h5>
                        <h5 className="hidden">hidd</h5>
                        <h5 className="headings">Sender</h5>
                        <h5 className="hidden">hidden text</h5>
                        <h5 className="hidden">hidden </h5>
                        <h5 className="headings">Recipient</h5>
                        <h5 className="hidden">hidden text</h5>
                        <h5 className="hidden">hidden te</h5>
                        <h5 className="headings">Date and Time</h5>
                        <h5 className="hidden">hidden text</h5>
                        <h5 className="hidden">hidd</h5>
                        <h5 className="headings">Sol</h5>
                      </div>
                      <div className="Divider"></div>
                      {carotTransfers.map((transfer) => {
                        return (
                          <div className="Transfers">
                            <a
                              className="links"
                              href={"https://solscan.io/tx/" + transfer.txHash}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <h5 className="headings">{transfer.txHash}</h5>
                            </a>
                            <a
                              className="links"
                              href={
                                "https://solscan.io/account/" + transfer.src
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              <h5 className="headings">{transfer.src}</h5>
                            </a>
                            <a
                              className="links"
                              href={
                                "https://solscan.io/account/" + transfer.dst
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              <h5 className="headings">{transfer.dst}</h5>
                            </a>
                            <h5 className="headings">
                              {new Date(
                                transfer.blockTime * 1000
                              ).toLocaleDateString()}
                            </h5>
                            <h5 className="headings">
                              {transfer.lamport / 1000000000}
                            </h5>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                {isAlpha && (
                  <>
                    <div className="Table">
                      <h4 className="chartname">Alpha Wallet Sol Transfers</h4>
                      <div className="TableHeadings">
                        <h5 className="headings">Tx Hash</h5>
                        <h5 className="hidden">hidden text</h5>
                        <h5 className="hidden">hidd</h5>
                        <h5 className="headings">Sender</h5>
                        <h5 className="hidden">hidden text</h5>
                        <h5 className="hidden">hidden </h5>
                        <h5 className="headings">Recipient</h5>
                        <h5 className="hidden">hidden text</h5>
                        <h5 className="hidden">hidden te</h5>
                        <h5 className="headings">Date and Time</h5>
                        <h5 className="hidden">hidden text</h5>
                        <h5 className="hidden">hidd</h5>
                        <h5 className="headings">Sol</h5>
                      </div>
                      <div className="Divider"></div>
                      {alphaTransfers.map((transfer) => {
                        return (
                          <div className="Transfers">
                            <a
                              className="links"
                              href={"https://solscan.io/tx/" + transfer.txHash}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <h5 className="headings">{transfer.txHash}</h5>
                            </a>
                            <a
                              className="links"
                              href={
                                "https://solscan.io/account/" + transfer.src
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              <h5 className="headings">{transfer.src}</h5>
                            </a>
                            <a
                              className="links"
                              href={
                                "https://solscan.io/account/" + transfer.dst
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              <h5 className="headings">{transfer.dst}</h5>
                            </a>
                            <h5 className="headings">
                              {new Date(
                                transfer.blockTime * 1000
                              ).toLocaleDateString()}
                            </h5>
                            <h5 className="headings">
                              {transfer.lamport / 1000000000}
                            </h5>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else if (wallet && !checkTokens) {
    return (
      <div className="DashboardMain">
        <h1 className="DashboardTitle">Holder's Dashboard</h1>
        <br></br>
        <br></br>
        <h1 className="NoPass">No VSN Pass Detected</h1>
        <Button
          href="https://magiceden.io/marketplace/bobbyrabbits"
          target="_blank"
          rel="noreferrer"
          style={{ width: "80%", fontSize: "4vh" }}
        >
          Request information on how to become a part of VSN
        </Button>
      </div>
    );
  } else {
    return (
      <div className="DashboardMain">
        <h1 className="DashboardTitle">Holder's Dashboard</h1>
        <br></br>
        <br></br>
        <h3 className="ConnectWallet">
          Connect Wallet Containing Bobby Rabbit's NFT for Access
        </h3>
        <WalletMultiButton className="selectWallet" />
      </div>
    );
  }
};

export default Dashboard;
