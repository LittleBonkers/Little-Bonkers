import { connectWallet } from "../utils/wallet";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { loadUser, logIn, signUp } from "../actions/user";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

const Sign = ({ loadUser, logIn, signUp, auth, alerts }) => {
  const [playerSrc, setPlayerSrc] = useState(0);
  const [bearSrc, setBearSrc] = useState(0);
  const [walletAddress, setWalletAddress] = useState(null);
  const [username, setUserName] = useState(null);

  useEffect(() => {
    const inter = setInterval(() => {
      setPlayerSrc((src) => {
        if (src == 17) return 0;
        return src + 1;
      });
      setBearSrc((src) => {
        if (src == 24) return 0;
        return src + 1;
      });
    }, 50);
    return () => {
      clearInterval(inter);
    };
  }, []);
  useEffect(() => {
    alerts.forEach((element) => {
      toast.error(element.msg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    });
  }, [alerts]);
  const signIn = async () => {
    if (walletAddress == null) {
      const address = await connectWallet();
      logIn(address);
    } else {
      logIn(walletAddress);
    }
  };
  const createAccount = async () => {
    if (username == null || username == "")
      toast.error("Input your username", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    else if (walletAddress == null) {
      toast.error("Connect your wallet", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      const res = await signUp(walletAddress, username);
    }
  };

  if (auth.isAuthenticated == true) return <Navigate to="/selectCharacter" />;
  return (
    <>
      <div className="w-full m-section flex items-center sm:justify-evenly">
        <div className="container px-5 py-5 rounded-lg bg-gray-800 sm:px-10 sm:w-[500px] w-[300px] m-auto ">
          <div className="flex justify-evenly items-center">
            <div className="m-idle hidden sm:block">
              <img
                width="100px"
                src={require(`../assets/player_idle/${playerSrc}.png`).default}
              ></img>
            </div>

            <div className="text-gray-300 text-xl h-[300px] ">
              <img
                src={require("../assets/Little_Bonkers_Logo.png").default}
                className="h-full m-auto"
              ></img>
            </div>
            <div className="m-idle hidden sm:block">
              <img
                width="100px"
                style={{
                  transform: "scaleX(-1)",
                }}
                src={require(`../assets/bear_idle/${bearSrc}.png`).default}
              ></img>
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-5">
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-color2"
              >
                USERNAME
              </label>
              <input
                type="text"
                name="name"
                id="emnameail"
                class="bg-gray-800 border border-gray-300 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={username}
                onChange={(e) => {
                  if (e.target.value.length <= 3) {
                    setUserName(e.target.value.toUpperCase());
                  }
                }}
                placeholder="Input your username (ONLY 3 LETTERS)"
              />
            </div>
            <div className="mb-10">
              <label
                for="address"
                class="block mb-2 text-sm font-medium text-gray-300 dark:text-white"
              >
                WALLET ADDRESS {
                  walletAddress &&
                  walletAddress[0] + walletAddress[1] + walletAddress[2] + walletAddress[3] + '...' + walletAddress[walletAddress.length - 4] + walletAddress[walletAddress.length - 3] + walletAddress[walletAddress.length - 2] + walletAddress[walletAddress.length - 1]
                }
              </label>
              <button
                type="button"
                className="w-full focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={async () => {
                  try {
                    const address = await connectWallet();
                    setWalletAddress(address);
                  } catch (err) {
                    alert(err);
                  }
                }}
              >
                Connect Wallet
              </button>
              <button
                type="button"
                className="w-full focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={createAccount}
              >
                Create Account
              </button>
            </div>
            <div className="text-white flex flex-row">
              <div className="text-color3">Already have an account?</div>
              <div
                className="mx-2 hover:font-bold hover:cursor-pointer underline"
                onClick={signIn}
              >
                Sign In
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  alerts: state.alert,
});
export default connect(mapStateToProps, { logIn, loadUser, signUp })(Sign);
