import { useRef, useState, useEffect, useCallback } from 'react';
import './player.scss';
import { Link } from "react-router-dom";
import {BsFillPlayCircleFill, BsFillPauseCircleFill, BsFillSkipStartCircleFill, BsSkipEndCircleFill, BsFillSkipEndCircleFill, BsPlayBtn, BsSkipBackwardBtn} from 'react-icons/bs';

import { Button, Grid, Paper } from "@material-ui/core";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useWalletNfts } from "@nfteyez/sol-rayz-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import filter from "../primaryfilter.json";

const Player = ({audioElem, isplaying, setisplaying, currentSong, setCurrentSong, songs})=> {

  let walletAddress = "";
  const wallet = useAnchorWallet();
  walletAddress = wallet?.publicKey.toString();
  const filterList = JSON.parse(JSON.stringify(filter));
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  const { nfts } = useWalletNfts({
    publicAddress: walletAddress,
    connection: connection,
  });

  const [metadata, setMetadata] = useState({});

  //Set Treasury Wallet For Solana Fee below
  const feeAddress = new PublicKey('CK3Dam3dsMUdupHXDYJwBkzPjLe6NHZ9GHC2LMCLxTYV')

  //Set Solana Fee (Solana has 9 decimals, 100_000_000 = 0.1 Solana)
  let upgradeFee = 69_000_000

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

  const filterArray = Object.keys(metadata)
  .filter((key) => filterList.includes(key))
  .reduce((obj, key) => {
    obj[key] = metadata[key];
    return obj;
  }, {});

  var result = Object.keys(filterArray).map((key) => [key, filterArray[key]]);
  const [tx, setTx] = useState("");
  const [selected, setSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onClick = (e, index) => {
    setSelected((selected) =>
      selected.includes(result[index][0])
        ? selected.filter(
            (n) => n !== selected[selected.indexOf(result[index][0])]
          )
        : [...selected, result[index][0]]
    );
    e.target.classList.toggle("imagesClicked");
  };

  const { publicKey, sendTransaction } = useWallet();

  const onSPLClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();
    setIsLoading(true);

    try {
      const transaction = new Transaction().add(
        //Solana Fee Code Below
            SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: feeAddress,
            lamports: upgradeFee,
        })
      );

      const signature = await sendTransaction( transaction, connection);
      const latestBlockHash = await connection.getLatestBlockhash();

      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: signature,
      });
      setTx(signature);
      console.log(signature);
      setIsLoading(false);
    } catch (error) {
      setTx("false");
      console.error(error);
      setIsLoading(false);
    }
  });

  const clickRef = useRef();

  const PlayPause = ()=>
  {
    setisplaying(!isplaying);

  }


  const checkWidth = (e)=>
  {
    let width = clickRef.current.clientWidth;
    const offset = e.nativeEvent.offsetX;

    const divprogress = offset / width * 100;
    audioElem.current.currentTime = divprogress / 100 * currentSong.length;

  }

  const skipBack = ()=>
  {
    const index = songs.findIndex(x=>x.title == currentSong.title);
    if (index == 0)
    {
      setCurrentSong(songs[songs.length - 1]) //randomize here!
    }
    else
    {
      setCurrentSong(songs[index - 1])
    }
    audioElem.current.currentTime = 0;
    
  }


  const skiptoNext = ()=>
  {
    const index = songs.findIndex(x=>x.title == currentSong.title);

    if (index == songs.length-1)
    {
      setCurrentSong(songs[0])
    }
    else
    {
      setCurrentSong(songs[index + 1])
    }
    audioElem.current.currentTime = 0;
    
  }

  return (
    <div className='player_container'>
      <div className="title">
        <p>{currentSong.title}</p>
      </div>
      <div className="navigation">
        <div className="navigation_wrapper" onClick={checkWidth} ref={clickRef}>
          <div className="seek_bar" style={{width: `${currentSong.progress+"%"}`}}></div>
        </div>
      </div>
      <div className="controls">
      <BsFillSkipStartCircleFill className='btn_action' onClick={skipBack}/>
        {isplaying ? <BsFillPauseCircleFill className='btn_action pp' onClick={PlayPause}/> : <BsFillPlayCircleFill className='btn_action pp' onClick={PlayPause}/>}
        <BsFillSkipEndCircleFill className='btn_action' onClick={skiptoNext}/>      
      </div>
      
      <div className='walletCard'>
        <Link to="/Marketplace">
            <div className='buybutton'>Purchase Music Rights</div>
            <i/>
        </Link>
      </div>   

      <div>
        {selected.length === 0 ? (
          <>
            {!isLoading ? (
              <Button
                size="large"
                className="transactionBtn"
                style={{ marginBottom: "30px" }}
                onClick={onSPLClick}
                disabled={!publicKey}
                >
                  Pity Button&reg;
              </Button>
                ) : (
              <Button
                size="large"
                variant="outlined"
                className="transactionBtn"
                >
                <CircularProgress />
              </Button>
            )}
          </>
        ) : (
          <h1 className="carots" style={{ marginBottom: "20px" }}>
            Make Your Selections
          </h1>
        )}
          {tx.length > 6 ? (
            <>
              <Alert severity="success" className='success'>
                Success - Transaction success{" "}
                  <strong>
                    <a
                      href={"https://solscan.io/tx/" + tx}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Check Tx on Solscan
                    </a>
                  </strong>
              </Alert>
                <h5 style={{ width: "90%" }}>
                  Transaction:{" "}
                    <a
                      href={"https://solscan.io/tx/" + tx}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {" "}
                      Transaction Link
                    </a>
                </h5>
                  </>
          ) : tx === "false" ? (
            <Alert severity="error">
              Error - Transaction was not confirmed-
                <strong>Please check wallet and try again</strong>
            </Alert>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    )
  }

export default Player