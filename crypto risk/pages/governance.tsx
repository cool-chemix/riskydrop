import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { ProgressBar } from "react-progressbar-fancy";
import Header from "../components/Header";
import contracts from "../contracts/abi";
import { useContractRead } from "wagmi";
import { useMediaQuery } from "react-responsive";

const Home: NextPage = () => {
  const isDesktop = useMediaQuery({ maxWidth: 1800 });
  const is1440p = useMediaQuery({
    minWidth: 2560,
    minHeight: 1440,
    maxWidth: 3839,
  });
  const isLaptop = useMediaQuery({ minWidth: 1440, maxWidth: 1820 });
  const is4k = useMediaQuery({ minWidth: 3840 });
  const { data: totalSupply } = useContractRead({
    address: contracts.drip.address as `0x`,
    abi: contracts.drip.abi,
    functionName: "totalSupply",
    watch: true,
  });

  return (
    <div className={styles.container}>
      <Header page="governance" />

      <main
        className={styles.main}
        style={{
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          width: "100vw",
          height: "80vh",
          backgroundImage: 'url("/waves.svg")'
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "200px"
          }}
        >
          <div
            style={{
              fontFamily: "Omletta-Regular",
              fontSize: (is4k && 72 * 1.5) || (isLaptop && 60) || 72,
              color: "#2c2c4c",
              textAlign: "center",
            }}
          >
            The DAO will be summoned when 1,000,000 DRIP are minted
          </div>
          <br></br>
          <div
            style={{
              fontFamily: "Omletta-Regular",
              paddingTop: "50px",
              fontSize: (is4k && 46 * 1.5) || 46,
              color: "#2c2c4c",
              textAlign: "center",
            }}
          >
            {(Number(totalSupply) / 10 ** 18).toLocaleString()} / 1,000,000
            DRIP minted
          </div>

          <br></br>
          <div
            style={{
              fontFamily: "Omletta-Regular",
              fontSize: (is4k && 24 * 1.5) || 24,
              color: "#2c2c4c",
              textAlign: "left",
              paddingTop: "50px",
            }}
          >
            <ProgressBar
              score={Math.floor(
                (100 * Number(totalSupply)) / 1000000 / 10 ** 18
              )}
              progressWidth={750}
              progressColor={"blue"}
              hideText={true}
              className="progress"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
