import { CandyShopDataValidator, Orders, Sell, Stat } from "@liqnft/candy-shop";
import { CandyShop } from "@liqnft/candy-shop-sdk";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRef } from "react";
import styled from "styled-components";
import {
  CANDY_SHOP_CREATOR_ADDRESS_FOX,
  CANDY_SHOP_PROGRAM_ID_FOX,
  CANDY_SHOP_TREASURY_MINT_FOX,
  NETWORK,
} from "../components/candy-shop-fox";

import "./Marketplace.css";

const Marketplace: React.FC = () => {
  const wallet = useAnchorWallet();
  const RPC = "https://api.devnet.solana.com";
  const candyShopRef = useRef<CandyShop>(
    new CandyShop({
      candyShopCreatorAddress: CANDY_SHOP_CREATOR_ADDRESS_FOX,
      treasuryMint: CANDY_SHOP_TREASURY_MINT_FOX,
      candyShopProgramId: CANDY_SHOP_PROGRAM_ID_FOX,
      env: NETWORK,
      // pass additional settings param to configure shop display
      settings: {
        currencySymbol: "$SOL",
        currencyDecimals: 9,
        priceDecimals: 2,
        volumeDecimals: 1,
        mainnetConnectionUrl: RPC,
      },
    })
  );
  return (
    <div className="CarotMarketMain" style={{ padding: 40 }}>
      {wallet ? (
        <CandyShopDataValidator>
          <DesContainer>
            <Stat
              candyShop={candyShopRef.current}
              title={"Music Marketplace"}
              description={"Purchace shares of ownership in your favorite tracks!"}
              style={{ paddingBottom: 50 }}
            />

            <h2
              style={{
                marginBottom: "20px",
                background: "black",
                color: "white",
                borderRadius: "20px",
                padding: "10px",
              }}
            >
              Purchace shares of ownership in your favorite tracks!
            </h2>
            <Orders
              wallet={wallet}
              candyShop={candyShopRef.current}
              walletConnectComponent={<WalletMultiButton />}
              filters={FILTERS}
              filterSearch
              search
            />
            <h2
              style={{
                marginBottom: "20px",
                background: "black",
                color: "white",
                borderRadius: "20px",
                padding: "10px",
              }}
            >
              List your shares for sale:
            </h2>
            <Sell
              wallet={wallet}
              candyShop={candyShopRef.current}
              walletConnectComponent={<WalletMultiButton />}
              enableCacheNFT={true}
            />
          </DesContainer>
        </CandyShopDataValidator>
      ) : (
        <>
          <h1>Please Connect Wallet</h1>
          <br></br>
          <WalletMultiButton />
        </>
      )}
    </div>
  );
};

export default Marketplace;

const FILTERS = [
  { name: "Almond Butter", collectionId: "1", identifier: 720991198 },
  { name: "Fourth Dimensional Thinking", collectionId: "2", identifier: 1615734886 },
  { name: "Under The Sun", collectionId: "3", identifier: -501266459 },
];

const DesContainer = styled.div`
  width: 100%;
`;
