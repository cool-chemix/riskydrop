import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import contracts from "../contracts/abi";
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useAccount,
} from "wagmi";
import { useEffect, useState } from "react";
import { multicall } from '@wagmi/core'
import Header from "../components/Header";
import { useMediaQuery } from "react-responsive";
import { createPublicClient, http } from 'viemNewest'
import { blastMainnet } from "./_app";

export const publicClient = createPublicClient({
  chain: blastMainnet,
  transport: http()
})

const Faucet: NextPage = () => {
  const auction: any = useContractRead({
    address: contracts.droplet_faucet.address as `0x`,
    abi: contracts.droplet_faucet.abi,
    functionName: "auction",
  }).data;
  const [topNftId] = useState<number>(
    auction ? 20 : 20
  );
  const [currentNftId, setCurrentNftId] = useState<Number>(1);
  const [watch, setwatch] = useState<boolean>(false)
  const [userNfts, setuserNfts] = useState<Array<any>>([])
  // const [finalNfts, setFinalNfts] = useState<any[]>([]);

  const account = useAccount();
  let multicallResults: any;
  let owners: any = []

  useEffect(() => {
    const multicallAsync = async () => {
      let dripAmounts = []
      let tempNfts = []
      let multicalls = []
      for (let i = 1; i <= 50; i++) {
        multicalls.push({
          address: contracts.droplet_nft.address as `0x`,
          abi: contracts.droplet_nft.abi,
          functionName: "ownerOf",
          args: [i],
        })
        multicalls.push({
          address: contracts.drip.address as `0x`,
          abi: contracts.drip.abi,
          functionName: "preview_mint",
          args: [i],
        })
      }
      //@ts-ignore
      multicallResults = await publicClient.multicall({ contracts: multicalls, multicallAddress: "0xca11bde05977b3631167028862be2a173976ca11" })
      owners = multicallResults.reduce((acc: bigint[], e: any, idx: number) => {
        if (e.result && idx % 2 == 0) {
          acc.push(e?.result)
          return acc
        }
        return acc
      }, [])
      dripAmounts = multicallResults.reduce((acc: bigint[], e: any, idx: number) => {
        if (e.result && idx % 2 !== 0) {
          acc.push(e?.result)
          return acc
        }
        else if (idx % 2 !== 0)
          acc.push(0n)
        return acc
      }, [])
      for (const [i, owner] of owners.entries()) {
        if (owner === account.address)
          tempNfts.push({
            address: owner,
            dropletId: i + 1,
            dripAmount: Number(dripAmounts[i]) / 10 ** 18
          })
      }
      setuserNfts(tempNfts)
    }

    multicallAsync().catch(console.error)
    const interval = setInterval(() => {
      multicallAsync().catch(console.error)
      return () => clearInterval(interval)
    }, 1000)
    setwatch((prevwatch) => !prevwatch)

  }, [setwatch])

  // for (let i = 1; i <= 7; i++) {
  //   const { data: dripAmount } = useContractRead({
  //     address: contracts.drip.address as `0x`,
  //     abi: contracts.drip.abi,
  //     functionName: "preview_mint",
  //     args: [i, account.address],
  //     watch: true,
  //   });
  //   if (
  //     owners &&
  //     typeof dripAmount !== "undefined" &&
  //     owners.includes(account.address)
  //   ) {
  //     userNfts.push({
  //       address: owner,
  //       dropletId: i,
  //       dripAmount: Number(dripAmount) / 10 ** 18,
  //     });
  //   }
  // }

  // useEffect(() => {
  //   if (account && account.address && userNfts.length > 0) {
  //     // console.log(userNfts)
  //     // const filterdNfts = userNfts.filter(nft => nft.address.toLowerCase() === account.address?.toLowerCase());
  //     // setFinalNfts(filterdNfts);
  //   }
  // }, [account, userNfts])

  const { config: configClaim } = usePrepareContractWrite({
    address: contracts.drip.address as `0x`,
    abi: contracts.drip.abi,
    functionName: "mint",
    args: [currentNftId, account.address],
  });

  const { data: dataClaim, write: writeClaim } = useContractWrite(configClaim);

  const claim = () => {
    writeClaim?.();
  };

  return (
    <div className={styles.container}>
      <Header page="faucet" />

      <main
        className={styles.main}
        style={{
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          width: "100vw",
          backgroundImage: 'url("/waves.svg")',
        }}
      >
        <div
          style={{
            fontSize: '2.08vw',
            fontFamily: "Omletta-Regular",
            color: "white",
            textAlign: "center",
            paddingTop: '11vw',
            paddingBottom: '2.8vw'
          }}
        >
          For each droplet you own, you earn DRIP,
          <br /> the Droplet DAO governance token, <br />{" "}
          and <span style={{ fontWeight: "bold", color: "gold" }}>
            Blast Points automatically!
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            maxWidth: '80vw'
          }}
        >
          {userNfts.map((nft) => (
            <div style={{ paddingLeft: "40px", paddingRight: "40px", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '4vw' }} key={nft.dropletId}>
              <div>
                <img
                  src={`/droplets/${nft.dropletId}.png`}
                  style={{
                    zIndex: -1,
                    width: '15.6vw',
                    height: '15.6vw',
                    clipPath: 'circle(50%)'
                  }}
                />
              </div>
              <button
                style={{
                  padding: "10px 15px",
                  marginTop: '1.04vw',
                  borderWidth: '0px',
                  width: '80%',
                  fontSize: '1.56vw',
                  background: "blue",
                  color: "white",
                  borderRadius: "5px",
                  WebkitBorderRadius: '20px',
                  MozBorderRadius: '100px',
                  cursor: "pointer",
                  fontFamily: "Omletta-Regular",
                }}
                onClick={() => {
                  setCurrentNftId(nft.dropletId);
                  claim();
                }}
              >
                Claim {Number(nft.dripAmount).toFixed(0) ?? 0} DRIP
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Faucet;
