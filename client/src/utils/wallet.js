var web3 = require("@solana/web3.js");

const depositWallet = "FeD2tyj9eVshx7ojP9La35w9ujSJvDB4FJzRCBYZ9ZJA";
const net = "devnet";
export const getProvider = () => {
  if ("phantom" in window) {
    const provider = window.phantom?.solana;
    if (provider?.isPhantom) {
      return provider;
    }
  }
};

export const connectWallet = async () => {
  const provider = getProvider();
  console.log("provider", provider);
  if (provider) {
    try {
      const response = await provider.connect();
      let wallet = response.publicKey.toString();
      return Promise.resolve(wallet);
    } catch (err) {
      return Promise.reject("Error While Connecting Phantom Wallet");
    }
  } else {
    return Promise.reject("You need to install Phantom Wallet!");
  }
};

export const deposit = async (amount) => {
  try {
    await connectWallet();
    const provider = await getProvider();
    var connection = new web3.Connection(web3.clusterApiUrl(net));
    var toPubkey = new web3.PublicKey(depositWallet);

    console.log(toPubkey, provider.publicKey);
    var transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: toPubkey,
        lamports: (web3.LAMPORTS_PER_SOL / 10) * amount,
      })
    );
    let blockhashObj = await connection.getRecentBlockhash();
    transaction.recentBlockhash = await blockhashObj.blockhash;

    transaction.feePayer = provider.publicKey;
    const { signature } = await provider.signAndSendTransaction(transaction);
    console.log(signature);
    return Promise.resolve(signature);
  } catch (err) {
    console.log(err);
    return Promise.reject("Deposit Failed");
  }
};
