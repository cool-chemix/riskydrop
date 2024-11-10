import type { NextPage } from "next";
import MobilePage from "../components/MobilePage";
import styles from "../styles/Home.module.css";
import { parseUnits } from "viem";
import contracts from "../contracts/abi";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
  useAccount,
  useWalletClient,
} from "wagmi";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import { useMediaQuery } from "react-responsive";

const Home: NextPage = () => {
  const auction: any = useContractRead({
    address: contracts.droplet_faucet.address as `0x`,
    abi: contracts.droplet_faucet.abi,
    functionName: "auction",
    watch: true,
  }).data;
  const [bidInput, setBidInput] = useState<Number>(auction?.amount ?? 0);

  const [isClient, setIsClient] = useState(false)
  const [dropletName, setDropletName] = useState("Droplet")

  useEffect(() => {
    setIsClient(true)
  }, [])

  const currTime = Number(new Date()) / 1000;
  const time = auction ? Number(auction?.end_time) - currTime : 86400;
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);

  const auctionNeedsSettling = (auction &&
    auction.amount >= BigInt(0) && 
    !auction?.settled &&
    currTime > Number(auction?.end_time)) as boolean;
  const needStarting = (auction && (auction?.settled || currTime > Number(auction?.end_time))) as boolean;
  // false
  // index.tsx:46 30000000000000000n
  // index.tsx:47 false
  // index.tsx:48 true
  // index.tsx:49 true
  // console.log(auctionNeedsSettling)
  // console.log(auction?.amount)
  // console.log(!auction?.settled)
  // console.log(currTime > Number(auction?.end_time))
  // console.log(auction?.settled)

  useEffect(() => {
    if (auction && isClient && auction?.dropletId) {
      fetch(`/droplets/${(auction?.dropletId ?? 0)}.json`).then(async (result) => {
        const metadata = await result.json();
        setDropletName(metadata.name)
      })
    }
  }, [auction, isClient])

  const { config: configBid } = usePrepareContractWrite({
    address: contracts.droplet_faucet.address as `0x`,
    abi: contracts.droplet_faucet.abi,
    functionName: "bid",
    args: [auction?.dropletId],
    value: BigInt(parseUnits(bidInput.toString(), 18)),
  });

  const { config: configStart } = usePrepareContractWrite({
    address: contracts.droplet_faucet.address as `0x`,
    abi: contracts.droplet_faucet.abi,
    functionName: "start_next_auction",
    enabled: needStarting
  });

  const { config: configSettle } = usePrepareContractWrite({
    address: contracts.droplet_faucet.address as `0x`,
    abi: contracts.droplet_faucet.abi,
    functionName: "settle_auction",
    enabled: auctionNeedsSettling
  });

  const { data: dataBid, write: writeBid } = useContractWrite(configBid);
  const { data: dataStart, write: writeStart } = useContractWrite(configStart);
  const { data: dataSettle, write: writeSettle } =
    useContractWrite(configSettle);

  const { isLoading: isLoadingBid, isSuccess: isSuccessBid } =
    useWaitForTransaction({
      hash: dataBid?.hash,
    });

  const { isLoading: isLoadingSettle, isSuccess: isSuccessSettle } =
    useWaitForTransaction({
      hash: dataSettle?.hash,
    });

  const bid = () => {
    writeBid?.();
  };
  const settle = () => {
    writeSettle?.();
  };

  const startNextAuction = () => {
    writeStart?.();
  };

  const isMobile = useMediaQuery({ maxWidth: 850 });
  const is1440p = useMediaQuery({
    minWidth: 2560,
    maxWidth: 3839, 
  });
  const is4k = useMediaQuery({ minWidth: 3840 });
  const isLaptop = useMediaQuery({ minWidth: 1440, maxWidth: 1920 });

  return (
    <>
      {isMobile ? <MobilePage /> :
        <div className={styles.container}>
          <Header page="" />
          <main
            className={styles.main}
            style={{
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundImage: 'url("/waves.svg")',
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              paddingLeft: (is1440p && "80px") || "0px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                width: '65%'
              }}
            >
              <img
                width='100%'
                src="logo.png"
              ></img>
              <div
                style={{
                  fontFamily: "Omletta-Regular",
                  fontSize: 72,
                  marginLeft: "40px",
                  color: "#2c2c4c",
                  textAlign: "center",
                }}
              >
                A New Era for NFT Liquidity
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                fontFamily: "Omletta-Regular",
                fontSize: (is4k && 80) || '2.19vw',
                paddingRight: (is4k && 0) || (isLaptop && 0) || 50,
                color: "white",
                marginTop: 100
              }}
            >
              {dropletName}
              <br></br>
              <div style={{ marginTop: "20px" }}>
                <img
                  src={`/droplets/${isClient && auction?.dropletId}.png`}
                  style={{
                    zIndex: -1,
                    width: (is4k && "1000px") || "30vw",
                    height: (is4k && "1000px") || "30vw",
                    clipPath: "circle(50%)"
                  }}
                />
              </div>
              <br></br>
              <div
                style={{
                  fontSize: (is4k && 80) || '2.19vw',
                  textAlign: "center",
                }}
              >
                Top Bid: Ξ{" "}
                {auction && isClient ? (Number(auction.amount) / 10 ** 18).toLocaleString() : 0}{" "}
                (Min: {auction && isClient ? (Number(auction.amount) * 1.05 / 10 ** 18).toLocaleString() : 0})
                <br/>
                {(minutes < 0 || hours < 0) && isClient && "Settle for next auction"}
                {
                  !(minutes < 0 || hours < 0) && isClient &&
                  `Auction Ends in ${hours}h ${minutes}m`
                }
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: (is4k && 80) || '2.19vw',
                  marginTop: "10px"
                }}
              >
                {auctionNeedsSettling && (
                  <button onClick={settle} className={styles.bidBtn}>
                    Settle
                  </button>
                )}
                {!auctionNeedsSettling && (
                  <button
                    style={{
                      fontSize: (is4k && 80) || 25,
                      height: (is4k && 100) || 48,
                    }}
                    onClick={() => {
                      !needStarting ? bid() : startNextAuction();
                    }}
                    className={styles.bidBtn}
                    disabled={isLoadingBid || isLoadingSettle}
                  >
                    {isLoadingBid || isLoadingSettle
                      ? "Loading..."
                      : !needStarting
                        ? "Bid"
                        : "Start Auction"}
                  </button>
                )}
                <input
                  className={styles.bidInput}
                  style={{
                    height: (is4k && "100px") || "40px",
                    fontSize: (is4k && 80) || 25,
                  }}
                  onChange={(val) => setBidInput(Number(val.target.value))}
                  disabled={auctionNeedsSettling as boolean}
                ></input>
              </div>
            </div>
          </main>
        </div>
      }
    </>
  );
};

export default Home;
