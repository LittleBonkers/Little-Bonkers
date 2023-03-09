
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { addTank, withDraw } from "../actions/user";
import { Link } from "react-router-dom";
import { deposit } from "../utils/wallet";
import { toast } from "react-toastify";

const Dashboard = ({ auth, addTank, withDraw, alerts }) => {
  const [name, setName] = useState("Forest");
  const [team, setTeam] = useState("Group3");
  const [earning, setEarning] = useState("100");
  const [tankCount, setTankCount] = useState(0);
  const [tankBuy, setTankBuy] = useState(1);
  const [wallet, setWalletAddress] = useState(null);
  
  useEffect(() => {
    alerts.forEach((element) => {
      if (element.alertType == "danger")
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
      else {
        toast.success(element.msg, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    });
  }, [alerts]);
  useEffect(() => {
    console.log(auth.user, "---");
    if (auth.user != null) {
      setName(auth.user.name);
      setTeam(auth.user.team);
      setEarning(auth.user.earn);
      setTankCount(auth.user.tankCount);
      setWalletAddress(auth.user.solana_wallet);
    }
  }, [auth]);

  const buyTank = async () => {
    await deposit(tankBuy);
    await addTank(tankBuy);
  };

  const withDrawAll = async () => {
    await withDraw();
  };
  if (auth.isAuthenticated == false) return <Navigate to="/signup" />;
  return (
    <>
      <div className="container mx-auto py-10 px-2">
        <div className="mx-auto rounded-lg px-10 py-5 bg-gray-800 md:w-1/2 w-3/4">
          <div className="flex flex-col text-white w-full mx-auto items-center my-20">
            <div className="my-5">
              {/* <img
                className="w-20 h-20 rounded-full"
                src={avatar}
                alt="Rounded avatar"
              /> */}
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 w-full">
              <div>
                <label
                  htmlFor="Username"
                  className="block mb-2 text-sm font-medium text-gray-100 dark:text-gray-300"
                >
                  USERNAME
                </label>
                <input
                  type="text"
                  id="Username"
                  className="bg-gray-700 border border-gray-500 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  // placeholder="John"
                  value={name}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="Team"
                  className="block mb-2 text-sm font-medium text-gray-100 dark:text-gray-300"
                >
                  Team name
                </label>
                <input
                  type="text"
                  id="Team"
                  className="bg-gray-700 border border-gray-500 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  // placeholder="Doe"
                  value={team}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="wallet_address"
                  className="block mb-2 text-sm font-medium text-gray-100 dark:text-gray-300"
                >
                  wallet address
                </label>
                <input
                  type="text"
                  id="wallet_address"
                  className="bg-gray-700 border border-gray-500 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  // placeholder="Doe"
                  value={wallet}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="Earning"
                  className="block mb-2 text-sm font-medium text-gray-100 dark:text-gray-300"
                >
                  Eaning
                </label>
                <input
                  type="text"
                  id="Earning"
                  className="bg-gray-700 border border-gray-500 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  // placeholder="Doe"
                  value={earning}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="Earning"
                  className="block mb-2 text-sm font-medium text-gray-100 dark:text-gray-300"
                >
                  TankCount
                </label>
                <input
                  type="text"
                  id="TankCount"
                  className="bg-gray-700 border border-gray-500 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  // placeholder="Doe"
                  value={tankCount}
                  required
                />
              </div>
            </div>
          </div>
          <div className="py-2">
            <label
              htmlFor="Earning"
              className="block mb-2 text-sm font-medium text-gray-100 dark:text-gray-300"
            >
              Buy Your Tanks with SOL ( 0.1 sol for 1 tank)
            </label>
            <input
              type="number"
              className="bg-gray-700 border border-gray-500 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="I want to buy tanks"
              value={tankBuy}
              onChange={(e) => {
                if (e.target.value > 0) setTankBuy(e.target.value);
              }}
              required
            />
          </div>
          <div className="flex w-full justify-center">
            <button
              type="button"
              className="w-full focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={withDrawAll}
            >
              Withdraw
            </button>
            <button
              type="button"
              className="w-full focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              onClick={buyTank}
            >
              Buy Tanks
            </button>
          </div>

          <Link to="/game">
            <button
              type="button"
              className="w-full focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              // onClick={buyTank}
            >
              Start Game
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  alerts: state.alert,
});
export default connect(mapStateToProps, { addTank, withDraw })(Dashboard);
