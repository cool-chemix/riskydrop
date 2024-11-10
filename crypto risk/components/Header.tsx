import { ConnectButton } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";

//@ts-ignore
export const Header = ({ page }) => {
    const isLaptopAndBelow = useMediaQuery({ maxWidth: 1279 });
    const isTabletAndBelow = useMediaQuery({ maxWidth: 1023 });
    const is4k = useMediaQuery({ minWidth: 3840 });
    return (
        <>
            <Head>
                <title>Droplet DAO</title>
                <meta content="The Number One NFT Liquidity Protocol" name="???" />
                <link href="/favicon.ico" rel="icon" />
            </Head>
            <header
                className={styles.header}
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    background: "linear-gradient(to right, #4e54c8, #8f94fb)",
                    width: "100vw",
                    height: isLaptopAndBelow && '8vw' || "4vw",
                    position: "fixed",
                    zIndex: 15,
                    resize: "vertical",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundImage: 'url("/header.svg")',
                    opacity: "1",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: 'center',
                        paddingRight: "5px",
                        opacity: "1",
                        width: "90%",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "90%",
                        }}
                    >
                        <Link
                            href="/"
                            style={{
                                left: "3%",
                                color: page === "" ? "aqua" : "black",
                                fontFamily: "Omletta-Regular",
                                fontSize: '2.5vw'
                            }}
                        >
                            Auction
                        </Link>
                        <Link
                            href="/faucet"
                            style={{
                                color: page === "faucet" ? "aqua" : "black",
                                fontFamily: "Omletta-Regular",
                                fontSize: '2.5vw'
                            }}
                        >
                            Faucet
                        </Link>
                        <Link
                            href="/risk"
                            style={{
                                color: page === "risk" ? "aqua" : "black",
                                fontFamily: "Omletta-Regular",
                                fontSize: '2.5vw'
                            }}
                        >
                            Risk
                        </Link>
                        <Link
                            href="/governance"
                            style={{
                                marginRight: "7vw",
                                color: page === "governance" ? "aqua" : "black",
                                fontFamily: "Omletta-Regular",
                                fontSize: '2.5vw'
                            }}
                        >
                            Governance
                        </Link>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingRight: (is4k && "20px") || "8px",
                    }}
                >
                    <ConnectButton />
                </div>
            </header>
        </>
    );
};

export default Header;
