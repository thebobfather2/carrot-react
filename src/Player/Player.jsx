import React, { useRef, useState, useEffect } from 'react';
import './player.css';
import {ethers} from 'ethers';
import {BsFillPlayCircleFill, BsFillPauseCircleFill, BsFillSkipStartCircleFill, BsSkipEndCircleFill, BsFillSkipEndCircleFill} from 'react-icons/bs';

const Player = ({audioElem, isplaying, setisplaying, currentSong, setCurrentSong, songs})=> {

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

  const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
  const [sendButtonText, setsendButtonText] = useState('Tip The Artist');
	const [provider, setProvider] = useState(null);

	const connectWalletHandler = () => {
		if (window.ethereum && defaultAccount == null) {
			// set ethers provider
			setProvider(new ethers.providers.Web3Provider(window.ethereum));

			// connect to metamask
			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				setConnButtonText('Wallet Connected');
				setDefaultAccount(result[0]);
			})
			.catch(error => {
				setErrorMessage(error.message);
			});

		} else if (!window.ethereum){
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

  const connectWalletSender = () => {
		if (window.ethereum && defaultAccount == null) {
			// set ethers provider
			setProvider(new ethers.providers.Web3Provider(window.ethereum));

			// connect to metamask
			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				setsendButtonText('Tip Sent!');
				setDefaultAccount(result[0]);
			})
			.catch(error => {
				setErrorMessage(error.message);
			});

		} else if (!window.ethereum){
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

useEffect(() => {
	if(defaultAccount){
	provider.getBalance(defaultAccount)
	.then(balanceResult => {
		setUserBalance(ethers.utils.formatEther(balanceResult));
	})
	};
}, [defaultAccount]);

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
        {isplaying ? <BsFillPauseCircleFill className='btn_action_pp' onClick={PlayPause}/> : <BsFillPlayCircleFill className='btn_action_pp' onClick={PlayPause}/>}
        <BsFillSkipEndCircleFill className='btn_action' onClick={skiptoNext}/>
      </div>
      
      <div className='walletCard'>
		<h2> TipBot </h2>
			<button onClick={connectWalletHandler}>{connButtonText}</button>
			<div className='accountDisplay'>
				<h4>Address: {defaultAccount}</h4>
			</div>
			<div className='balanceDisplay'>
				<h4>Balance: {userBalance}</h4>
			</div>
      <button onClick={connectWalletSender}>{sendButtonText}</button>
      <div className='walletDisplay'>
				<h4>Artist Wallet 1 test: {currentSong.address1}</h4>
        <h4>Artist Wallet 2 test: {currentSong.address2}</h4>
			</div>
			{errorMessage}
		</div>
    </div>
  
  )
}

export default Player