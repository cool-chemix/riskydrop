import drip from "./drip.json";
import droplet_faucet from "./droplet_faucet.json";
import droplet_nft from "./droplet_nft.json";
import stream from "./stream.json";
import summoner from "./summoner.json";

export default {
    drip: {
        address: "0xEe9aCF533d1545aB82f4DD635A9Dc8916eF41CBD",
        abi: drip.abi
    },
    droplet_faucet: {
        address: "0x58b1973130555741716ac1acaef380b482fd1e83",
        abi: droplet_faucet.abi
    },
    droplet_nft: {
        address: "0x57B57471ec1bA3e76c0B0a64248C2F37307056DE",
        abi: droplet_nft.abi
    },
    stream: {
        address: "0x2F48272CcF4f6b77729A37385860a505283A5d33",
        abi: stream.abi
    },
    summoner: {
        abi: summoner.abi
    },
}
