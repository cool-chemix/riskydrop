import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import contracts from "../contracts/abi";
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useAccount,
} from "wagmi";
import { useState } from "react";
import Header from "../components/Header";
import { useMediaQuery } from "react-responsive";

const Bonding: NextPage = () => {
  const isDesktop = useMediaQuery({ maxWidth: 1800 });
  const is1440p = useMediaQuery({
    minWidth: 2560,
    maxWidth: 3839,
  });
  const is4k = useMediaQuery({ minWidth: 3840 });
  const auction: any = useContractRead({
    address: contracts.droplet_faucet.address as `0x`,
    abi: contracts.droplet_faucet.abi,
    functionName: "auction",
  }).data;
  const [topNftId] = useState<number>(
    auction ? 20 : 20
  );
  const [currentNftId, setCurrentNftId] = useState<Number>();
  const [readyToRender, setReadyToRender] = useState<Number>();

  const account = useAccount();

  const { config: configBond } = usePrepareContractWrite({
    address: contracts.stream.address as `0x`,
    abi: contracts.stream.abi,
    functionName: "bond_nft",
    args: [currentNftId],
    enabled: Number(currentNftId) > 0,
  });

  const { data: dataClaim, write: writeBond } = useContractWrite(configBond);

  const { config: configApprove } = usePrepareContractWrite({
    address: contracts.droplet_nft.address as `0x`,
    abi: contracts.droplet_nft.abi,
    functionName: "setApprovalForAll",
    args: [contracts.stream.address, true],
  });

  const { data: dataApprove, write: writeApprove } =
    useContractWrite(configApprove);

  const bond = () => {
    writeBond?.();
  };

  const approve = () => {
    writeApprove?.();
  };

  const currTime = Number(new Date()) / 1000;

  let bondedNfts: any[] = [];
  for (let i = 1; i <= topNftId; i++) {
    try {
      const bond: any = useContractRead({
        address: contracts.stream.address as `0x`,
        abi: contracts.stream.abi,
        functionName: "nft_bonds",
        args: [i],
        watch: true,
      }).data;
      if (bond && bond.owner !== "0x0000000000000000000000000000000000000000") {
        const time =
          Number(bond.maturity) > currTime
            ? Number(bond.maturity) - currTime
            : 86400;
        const days = Math.floor(time / 86400);
        const hours = Math.floor((time - days * 86400) / 3600);
        const minutes = Math.floor((time - days * 86400 - hours * 3600) / 60);
        const maturity =
          days > 0 ? `${days}D ${hours}H` : `${hours}H ${minutes}M`;
        bondedNfts.push({ address: bond.owner, dropletId: i, maturity });
      }
    } catch (err) {
      console.log(err);
    }
  }

  let userNfts: any[] = [];
  // user nfts
  for (let i = 1; i <= topNftId; i++) {
    try {
      const { data: owner } = useContractRead({
        address: contracts.droplet_nft.address as `0x`,
        abi: contracts.droplet_nft.abi,
        functionName: "ownerOf",
        args: [i],
        watch: true,
      });
      const { data: dripAmount } = useContractRead({
        address: contracts.drip.address as `0x`,
        abi: contracts.drip.abi,
        functionName: "preview_mint",
        args: [i, "0xdD41315B8e9EA760466a46D6E31121454273B679"],
        watch: true,
      });
      if (owner && typeof dripAmount !== "undefined") {
        const { data: approved } = useContractRead({
          address: contracts.droplet_nft.address as `0x`,
          abi: contracts.droplet_nft.abi,
          functionName: "isApprovedForAll",
          args: [owner, contracts.stream.address],
          watch: true,
        });
        if (typeof approved !== "undefined") {
          userNfts.push({
            address: owner,
            dropletId: i,
            dripAmount: Number(dripAmount) / 10 ** 18,
            approved,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className={styles.container}>
      <Header page="bonding" />

      <main
        className={styles.main}
        style={{
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          width: "100vw",
          height: "80vh",
          backgroundImage: 'url("/waves.svg")',
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "30vh",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: (is4k && "80px") || (is1440p && "60px") || "42px",
            fontFamily: "Omletta-Regular",
            color: "white",
            textAlign: "center",
          }}
        >
          Bond your Droplet NFT to earn liquidity fees.
          <br /> Lock for 1 month to earn{" "}
          <span style={{ fontWeight: "bold", color: "gold" }}>DRIP</span>{" "}
          rewards !
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
            transform: "translateY(50%)",
          }}
        >
          {account &&
            bondedNfts
              .filter(
                (nft) =>
                  nft.address.toLowerCase() === account.address?.toLowerCase()
              )
              .map((nft) => (
                <div
                  key={`bond-${nft.dropletId}`}
                  style={{ paddingLeft: "40px", paddingRight: "40px" }}
                >
                  <div>
                    <img
                      src={`/droplets/${nft.dropletId}.png`}
                      style={{ zIndex: -1, width: "250px", height: "250px" }}
                    />
                  </div>
                  <button
                    style={{
                      padding: "15px 20px",
                      fontSize: "40px",
                      background: "#010057",
                      color: "white",
                      borderRadius: "5px",
                      fontFamily: "Omletta-Regular",
                    }}
                    disabled={true}
                  >
                    #{nft.dropletId} ({nft.maturity})
                  </button>
                </div>
              ))}

          {account &&
            userNfts
              .filter(
                (nft) =>
                  nft.address.toLowerCase() === account.address?.toLowerCase()
              )
              .map((nft) => {
                return (
                  <div
                    key={nft.dropletId}
                    style={{ paddingLeft: "40px", paddingRight: "40px" }}
                  >
                    <div>
                      <img
                        src={`/droplets/${nft.dropletId}.png`}
                        style={{ zIndex: -1, width: "250px", height: "250px" }}
                      />
                    </div>
                    <button
                      style={{
                        padding: "15px 58px",
                        fontSize: "40px",
                        background: "blue",
                        color: "white",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontFamily: "Omletta-Regular",
                      }}
                      onClick={() => {
                        setCurrentNftId(nft.dropletId);
                        nft.approved ? bond() : approve();
                      }}
                    >
                      {nft.approved
                        ? `Bond #${nft.dropletId}`
                        : `Allow #${nft.dropletId}`}
                    </button>
                  </div>
                );
              })}
        </div>
      </main>
    </div>
  );
};

export default Bonding;
