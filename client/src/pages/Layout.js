import { connect } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { logout } from "../actions/user";
import { Navigate } from "react-router-dom";
import { useRef, useEffect } from "react";

const { Outlet, Link } = require("react-router-dom");
const Layout = ({ auth, alert, logout }) => {

  const aud = useRef();
  useEffect(() => {
    aud.current.setAttribute("autoplay", "");
  }, [])
  return (
    <>
      <div className="relative h-[100vh]">
        <nav className="border-gray-200 px-2 sm:px-4  rounded dark:bg-green-900 bg-green-900">
          <div className="container flex flex-wrap justify-between items-center mx-auto">
            <a href="#" className="flex items-center">
              <img
                src={require("../assets/Little_Bonkers_Logo.png").default}
                className="mr-3 h-6 sm:h-9"
                alt="Flowbite Logo"
              />
              <span className="self-center text-xl font-semibold whitespace-nowrap text-color1">
                Bonkers
              </span>
            </a>
            <button
              data-collapse-toggle="navbar-default"
              type="button"
              className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-default"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <div
              className="bg-green-900 hidden w-full md:block md:w-auto"
              id="navbar-default"
            >
              <ul className="flex flex-col p-4 mt-4 bg-green-900 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <Link
                    to="/"
                    className="block py-2 pr-4 pl-3 text-gray-400 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
                {auth.isAuthenticated == true ? (
                  <li>
                    <Link
                      to="/Scoreboard"
                      className="block py-2 pr-4 pl-3 text-gray-400 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    >
                      Scoreboard
                    </Link>
                  </li>
                ) : (
                  ""
                )}

                <li>
                  <Link
                    to="/withdraw"
                    className="block py-2 pr-4 pl-3 text-gray-400 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Withdraw
                  </Link>
                </li>

                <li>
                  <Link
                    to="#"
                    className="block py-2 pr-4 pl-3 text-gray-400 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Contact
                  </Link>
                </li>
                {auth.isAuthenticated == true ? (
                  <li>
                    <Link
                      to="/signup"
                      className="block py-2 pr-4 pl-3 text-gray-400 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                      onClick={() => {
                        logout();
                      }}
                    >
                      Log Out
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link
                      to="/signup"
                      className="block py-2 pr-4 pl-3 text-gray-400 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    >
                      Sign Up / In
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <audio ref={aud} autoplay={true} src={require('./game/assets/audio/IntroMusic.mpeg').default}></audio>
        </nav>
        {/* <div className="relative "> */}

        <div className="m-background"><Outlet /></div>
        {/* </div> */}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  alert: state.alert,
});
export default connect(mapStateToProps, { logout })(Layout);
