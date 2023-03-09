import Phaser from "phaser";

import { useLocation } from "react-router-dom";
import { useEffect } from "react";

import Loading from './scenes/Loading';
import Battle from "./scenes/Battle";
import BattleWeb from "./scenes/BattleWeb";

import { Link } from "react-router-dom";
import { isMobile } from "../../utils/utils";
const boardConfig = require("./config.json");

const Main = (props) => {

  const location = useLocation();

  useEffect(() => {
    const loading = new Loading({ key: 'loading' });
    let player = location.state.player ? location.state.player : "Zephyr";
    let battle;
    if (isMobile())
      battle = new Battle({ key: 'battle', player: player });
    else {
      battle = new BattleWeb({ key: 'battle', player: player });
    }
    const config = {
      type: Phaser.AUTO,
      parent: "game",
      ...boardConfig,
      physics: {
        default: "arcade",
        arcade: {
          debug: true,
          gravityY: 0

        },
      },
      background: "black",
      scene: [loading, battle],
      scale: {
        mode: isMobile() ? Phaser.Scale.NONE : Phaser.Scale.FIT,
        parent: "game",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        // width: 1024,
        // height: 768
        // width: isMobile() ? 1280 : window.innerWidth,
        // height: isMobile() ? 600 : window.innerHeight,
        width: window.innerWidth,
        height: window.innerHeight,

      },
    };
    const game = new Phaser.Game(config);
    game.scene.start('loading');

    // return (() => {
    //   game = null;
    // })
  }, [])

  return <>

    {/* <Link to="/withdraw" id="navTowith" /> */}
    <Link to="/withdraw" id="navTowith" />
  </>;
};

export default Main;
