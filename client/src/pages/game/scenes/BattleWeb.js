import Phaser, { Scene } from "phaser";
// components
import Character from "../components/Character";
import { MAX_ENEMY, BEAR, BOSS, ZEPHYR, FIRE, LIGHTNING, SHIBA, LEFT, RIGHT, UP, DOWN, DELTA_X, DELTA_Y } from "../playerConfig";
import { STATE_RUNNING, STATE_SLASHING_IDLE, STATE_SLASHING_RUNNING, STATE_KICKING, STATE_SLIDING, STATE_ATTACKING, STATE_HURTING, STATE_IDLING, STATE_WALKING, STATE_DYING, STATE_WAITING } from '../playerConfig';

import { sleep } from "../playerConfig";

import api from "../../../utils/api";

import Joystick from "../components/Joystick";

import { isMobile } from "../../../utils/utils";
//images

import numbers from '../assets/sprites/numbers.png';
import numbersJson from '../assets/jsons/numbers.json';
import defeatedImage from '../assets/sprites/defeat.png';

import back1 from '../assets/background/game_background_1.png';
import back2 from '../assets/background/game_background_2.png';
import back3 from '../assets/background/game_background_3.png';
import back4 from '../assets/background/game_background_4.png';
import back5 from '../assets/background/game_background_5.png';

import bear from '../assets/sprites/bear.png'
import zephyr from "../assets/sprites/zephyr.png";
import fire from "../assets/sprites/fire.png";
import shiba from "../assets/sprites/shiba.png";
import lightning from "../assets/sprites/lightning.png";
import hp from "../assets/sprites/hp.png";

import go from "../assets/sprites/go.png"
import mana from "../assets/sprites/mana.png"

import pin from "../assets/sprites/Pin.png";

import boss from "../assets/sprites/boss.png";

import audio1 from "../assets/audio/Level1Music.mp3"
import audioBoss from "../assets/audio/BossMusic.mp3"



import audioBearAttack from "../assets/audio/ZombieAttack.wav";
import audioSlash from "../assets/audio/SwordSwing.mp3";
import audioBearDie from "../assets/audio/ZombieDying.wav";
import audioEnd from "../assets/audio/GameEnd.wav";
import audioDefeat from "../assets/audio/Continue.mp3";
// import audioBearAttack from "../assets/audio/ZombieAttack.wav";
//json
const bossJson = require('../assets/jsons/boss.json');
const bearJson = require('../assets/jsons/bear.json');
const zephyrJson = require('../assets/jsons/zephyr.json');
const fireJson = require('../assets/jsons/fire.json');
const lightningJson = require('../assets/jsons/lightning.json');
const shibaJson = require('../assets/jsons/shiba.json');
const hpJson = require('../assets/jsons/hp.json');
const manaJson = require('../assets/jsons/mana.json');


const initialEnemey = [2, 6, 7, 8, 9];
//

var width = isMobile() ? 1280 : window.innerWidth;
var height = isMobile() ? 600 : window.innerHeight;
class BattleWeb extends Scene {
    constructor(props = null) {

        super({
            ...props,
            // scale: {
            //     mode: Phaser.Scale.FIT,
            //     parent: "game",
            //     autoCenter: Phaser.Scale.CENTER_BOTH,
            //     width: 800,
            //     height: 600,

            // },

        });

        // initial image config;       


        this.totalTime = 0;

        this.type = props.player;

        this.currentLevel = 0;
        this.currentEnemies = 0;
        this.score = 0;
        this.ended = false;
        //flags
        this.isSliding = false;
        this.enemies = [];
        this.padX = 0;
        this.padY = 0;
        this.backImages = [];
        this.buttonSpec = null;

    }

    preload() {



        this.load.audio('intro', audio1);
        this.load.audio('introBoss', audioBoss);
        this.load.audio('audioBearAttack', audioBearAttack);
        this.load.audio('audioBearDie', audioBearDie);
        this.load.audio('audioSlash', audioSlash);
        this.load.audio('audioEnd', audioEnd);
        this.load.audio('audioContinue', audioDefeat);


        this.load.image('go', go);
        this.load.image("background1", back1);
        this.load.image("background2", back2);
        this.load.image("background3", back3);
        this.load.image("background4", back4);
        this.load.image("background5", back5);

        this.load.atlas("bear", bear, bearJson);
        this.load.atlas("boss", boss, bossJson);

        this.load.atlas('numbers', numbers, numbersJson);

        if (this.type == FIRE) {
            this.load.atlas(this.type, fire, fireJson);
        }
        if (this.type == SHIBA) {
            this.load.atlas(this.type, shiba, shibaJson);
        }
        if (this.type == LIGHTNING) {
            this.load.atlas(this.type, lightning, lightningJson);
        }
        if (this.type == ZEPHYR) {
            this.load.atlas(this.type, zephyr, zephyrJson);
        }


        this.load.atlas("hp", hp, hpJson);
        this.load.atlas("mana", mana, hpJson);

        this.load.image("pin", pin);

        this.load.image("defeatedImage", defeatedImage);


        // this.load.atlas(ZEPHYR, zephyr, zephyrJson);
        // this.load.atlas("Fire", fire, fireJson);

        {

            var progressBar = this.add.graphics();
            var progressBox = this.add.graphics();
            progressBox.fillStyle(0x222222, 0.8);
            progressBox.fillRect(width / 2 - 160, height / 2, 320, 30);


            var loadingText = this.make.text({
                x: width / 2,
                y: height / 2 - 50,
                text: 'Loading...',
                style: {
                    font: '20px monospace',
                    fill: '#ffffff'
                }
            });
            loadingText.setOrigin(0.5, 0.5);

            var percentText = this.make.text({
                x: width / 2,
                y: height / 2 - 5,
                text: '0%',
                style: {
                    font: '18px monospace',
                    fill: '#ffffff'
                }
            });
            percentText.setOrigin(0.5, 0.5);

            var assetText = this.make.text({
                x: width / 2,
                y: height / 2 + 50,
                text: '',
                style: {
                    font: '18px monospace',
                    fill: '#ffffff'
                }
            });
            assetText.setOrigin(0.5, 0.5);
        }
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 160, height / 2, 300 * value, 30);
        });

        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });



    }
    async create() {


        //controller
        this.input.addPointer()

        // sound
        this.levelSound = this.sound.add("intro", { volume: 0.2 });
        this.bossSound = this.sound.add("introBoss", { volume: 0.2 });
        this.slashSound = this.sound.add("audioSlash");
        this.bearAttackSound = this.sound.add("audioBearAttack");
        this.bearDieSound = this.sound.add("audioBearDie");
        this.endSound = this.sound.add('audioEnd');
        this.continueSound = this.sound.add('audioContinue');
        //==================================================
        {
            let scaleW = width / 3840;
            let scaleH = height / 2160;
            this.backImages.push(this.add.image(width * 0.5, height * 0.5, "background1").setOrigin(0.5, 0.5).setScale(scaleW, scaleH));
            this.backImages.push(this.add.image(width * 1.5, height * 0.5, "background2").setOrigin(0.5, 0.5).setScale(scaleW, scaleH));
            this.backImages.push(this.add.image(width * 2.5, height * 0.5, "background3").setOrigin(0.5, 0.5).setScale(scaleW, scaleH));
            this.backImages.push(this.add.image(width * 3.5, height * 0.5, "background4").setOrigin(0.5, 0.5).setScale(scaleW, scaleH));
            this.backImages.push(this.add.image(width * 4.5, height * 0.5, "background5").setOrigin(0.5, 0.5).setScale(scaleW, scaleH));



            this.statusBar = this.add.container(200, 100).setDepth(9999);
            this.hpBar = this.add.sprite(0, 0, "hp");
            this.manaBar = this.add.sprite(0, 0, "mana");
            this.statusBar.add([this.hpBar, this.manaBar]).setScale(0.5, 0.5).setScrollFactor(0);
        }



        // create animation
        this.createPlayerAnimations(this.type);
        this.createBearAnimations();
        this.createBossAnimations();


        // this.test = this.add.circle().



        this.arrows = this.input.keyboard.createCursorKeys();
        this.controllers = this.input.keyboard.addKeys('W,A,S,D,J,K,L');

        this.player = new Character(this, {
            type: this.type,
            direction: RIGHT,
            x: width / 2 - 100,
            y: height / 2,
            speed: 40 * 1.25,
            state: STATE_WAITING,
            scale: 1,
            body_width: 140,
            body_height: 20,
            offsetY: 130,
            offsetX: 0,
            shadow_width: 100,
            shadow_height: 20,
            shadow_x: 20,
            shadow_y: 130,
            range: 100,
            hp: 10,
            currentHp: 10,

        });

        this.player.body.on("attack", (data) => {
            //console.log("player attacking");
            this.slashSound.play();
            for (let i = 0; i < this.enemies.length; i++) {


                if (this.enemies[i].currentHp <= 0) {
                    this.enemies[i].updateState(STATE_DYING);
                    continue;
                }

                let dx = this.getDeltaX(this.player, this.enemies[i]);
                let dy = this.getDeltaY(this.player, this.enemies[i]);
                let h = null;
                let v = null;
                if (dx > this.enemies[i].config.range)
                    h = RIGHT;
                if (dx < - this.enemies[i].config.range) h = LEFT;
                else {

                    if (dx > 0 && this.enemies[i].direction() == LEFT) {
                        h = RIGHT;
                    }
                    else if (dx < 0 && this.enemies[i].direction() == RIGHT) {
                        h = LEFT;
                    }
                }

                if (dy > DELTA_Y)
                    v = DOWN;
                if (dy < -DELTA_Y) v = UP;





                if (Math.abs(dx) <= this.player.config.range && Math.abs(dy) <= DELTA_Y && ((dx > 0 && this.player.direction() == LEFT) || ((dx < 0 && this.player.direction() == RIGHT)))) {
                    //console.log("enemy is fool", this.enemies[i].config.currentHp)
                    this.enemies[i].config.currentHp--;
                    if (this.enemies[i].config.currentHp >= 1) {
                        this.enemies[i].updateState(STATE_HURTING);
                    }
                    else {
                        this.enemies[i].updateState(STATE_DYING);
                        this.enemies[i].die();
                        this.bearDieSound.play();
                    }


                }
            }


        });

        // this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, width * 5, height);
        this.physics.world.setBounds(0, 0, width * 5, height);

        // this.cameras.main.rotateTo(Math.PI / 2);
        this.cameras.main.startFollow(this.player.body);







        if (isMobile() == true) {
            this.stick = new Joystick({ scene: this, x: 200, y: height - 200, holder: zephyr, pin: "pin", delta: width / 2 });


            this.stick.on("mousemove", (dx, dy) => {
                this.padX = dx;
                this.padY = dy;
                //// console.log(this.padX, this.padY);
            })
            this.stick.on("dragStopped", () => {
                this.padX = 0;
                this.padY = 0;
            })


            this.SlideButton = this.add.circle(width - 150, height - 140, 30, 0xff0000).setInteractive().setDepth(9999);
            this.SlideButton.setScrollFactor(0);
            this.SlideButton.on('pointerdown', () => {
                this.SlideButton.setAlpha(0.5);
                this.buttonSpec = "SLIDE";
            })
            this.SlideButton.on('pointerup', () => {
                this.SlideButton.setAlpha(1);
                this.buttonSpec = null;
            })

            this.SlashButton = this.add.circle(width - 200, height - 200, 30, 0x00ffff).setInteractive().setDepth(9999);
            this.SlashButton.setScrollFactor(0);
            this.SlashButton.on('pointerdown', () => {
                this.SlashButton.setAlpha(0.5);
                this.buttonSpec = "SLASH";
            })
            this.SlashButton.on('pointerup', () => {
                this.SlashButton.setAlpha(1);
                this.buttonSpec = null;
            })

            this.KickButton = this.add.circle(width - 100, height - 200, 30, 0xffff00).setInteractive().setDepth(9999);
            this.KickButton.setScrollFactor(0);
            this.KickButton.on('pointerdown', () => {
                this.KickButton.setAlpha(0.5);
                this.buttonSpec = "KICK";
            })
            this.KickButton.on('pointerup', () => {
                this.KickButton.setAlpha(1);
                this.buttonSpec = null;
            })
        }


        // this.SlideButton.on('pointerdown', () => { })
        // this.txt = this.add.text(width / 2, height / 2, `GAME OVER`, { fontFamily: 'bonkerFont', fontSize: 120, color: '#ff00ff' }).setOrigin(0.5, 0.5).setDepth(9999).setAlpha(0);

        let sW = width / 1920
        let sH = height / 1080;
        this.defeatedImage = this.add.image(width / 2, height / 2, "defeatedImage").setDepth(10000).setScrollFactor(0).setAlpha(0).setScale(sW, sH);

        this.go = this.add.image(width - 100, height / 2, 'go').setOrigin(0.5, 0.5).setScale(0.2, 0.2).setDepth(10000).setAlpha(0).setScrollFactor(0);

        this.numbers = this.add.sprite(width / 2, height / 2, "numbers").setScale(0.5).setScrollFactor(0).setDepth(100001).setAlpha(0);

        // this.go.fix
        this.go.setScrollFactor(0)

        await this.nextLevel();

    }
    update() {
        //console.log(this.ended, "game ended");

        if (!this.player || this.ended == true) return;
        if (this.player && this.player.config.currentHp >= 0)
            this.hpBar.setFrame(`HP${this.player.config.hp - this.player.config.currentHp + 1}`);

        if (this.player.config.currentHp <= 0) {
            this.enemies.forEach((enemy) => {
                enemy.updateState(STATE_IDLING);

            })
            // this.txt.setText("Game Over");
            // this.txt.setAlpha(1)
            this.add.tween({
                targets: this.defeatedImage,
                alpha: 1,
                duration: 3000,
                ease: 'Power2',
                delay: 3000,
                onComplete: () => {
                    this.numbers.setAlpha(1);
                    this.numbers.play('Number');
                    this.numbers.on('animationcomplete', () => {
                        window.location.reload();
                    })

                },
            })
            this.bossSound.stop();
            this.continueSound.play();
            // this.defeatedImage.setAlpha(1);
            this.ended = true;
            return true;
        }

        // console.log(this.totalTime);
        this.totalTime++;
        // this.txt.setText(`time:${~~(this.totalTime / 10)}`);

        if (this.enemies.length == 0) {
            if (this.currentLevel == 5) {
                let sc = this.player.config.currentHp * 1000000 - this.totalTime;
                alert(sc);
                api.post("/users/addScore", { score: sc }).then((res) => { document.getElementById("navTowith").click(); });
            }
            // this.currentLevel++;
            this.currentEnemies = 0;

            if (this.go.alpha == 0) {
                this.showGo(true);


            }
            else {
                if (this.player.x() > (this.currentLevel) * width + width / 2) {
                    this.showGo(false);
                    this.nextLevel();
                    // this.showGo(true);
                }
            }
        }

        let h = null, v = null;
        let isRunning = false, isSlashing = false;
        let keyPressed = false;


        // WALKING
        if (this.controllers.A.isDown) {
            h = LEFT;
            keyPressed = true;
        }
        if (this.controllers.D.isDown) {
            h = RIGHT;
            keyPressed = true;
        }
        if (this.controllers.W.isDown) {
            v = UP;
            keyPressed = true;
        }
        if (this.controllers.S.isDown) {
            v = DOWN;
            keyPressed = true;
        }

        // if (this.padX < 0) {
        //     h = LEFT;
        // } else if (this.padX > 0) h = RIGHT;
        // if (this.padY < 0) {
        //     v = UP;
        // } else if (this.padY > 0) v = DOWN;


        let angle = Math.atan(this.padY / (this.padX + 0.0000001));
        angle = angle * 180 / (Math.PI);

        if (Math.abs(Math.abs(angle) - 90) <= 22.5) {

            if (this.padY < 0)
                v = UP;
            else if (this.padY > 0) v = DOWN;
        }
        if (Math.abs(Math.abs(angle) - 0) <= 22.5) {

            if (this.padX > 0)
                h = RIGHT;
            else if (this.padX < 0) h = LEFT;
        }
        if (Math.abs(Math.abs(angle) - 45) <= 22.5) {
            if (this.padX > 0)
                h = RIGHT;
            else if (this.padX < 0) h = LEFT;
            if (this.padY < 0)
                v = UP;
            else if (this.padY > 0) v = DOWN;

        }
        if (h == null && v == null) {
            //console.log(angle);
        }
        // if (this.canGo() == false) {
        //     h = null;
        //     v = null;
        // }
        if (this.canGoLeft() == false && h == LEFT) {
            h = null;
        }
        if (this.canGoRight() == false && h == RIGHT) {
            h = null;
        }
        // RUNNING
        if (this.arrows.shift.isDown || this.padX ** 2 + this.padY ** 2 >= 2000) {
            isRunning = true;
            keyPressed = true;
        }
        //SLASHING
        if (this.controllers.J.isDown || this.buttonSpec == "SLASH") {
            keyPressed = true;
            isSlashing = true;
        }

        if (this.controllers.K.isDown || this.buttonSpec == "SLIDE") {
            keyPressed = true;
            // isSlashing = true;
        }

        // JUMPING
        // if (this.arrows.space.isDown) {
        //     jumpStarted = true;
        // }

        //Kick
        if (this.controllers.L.isDown || this.buttonSpec == "KICK") {
            this.player.updateState(STATE_KICKING);

        }
        else if ((this.controllers.K.isDown || this.buttonSpec == "SLIDE") && this.isSliding == false) {

            if (this.canGoLeft() == false && this.player.direction() == LEFT) {
                // h = null;
            }
            else if (this.canGoRight() == false && this.player.direction() == RIGHT) {
                // h = null;
            }
            else {
                this.player.updateState(STATE_SLIDING);
                this.isSliding = true;
                setTimeout(() => {

                    this.isSliding = false;
                }, 500)
            }
        }

        if (h != null || v != null) {

            if (isRunning || true) {

                if (isSlashing) {
                    this.player.updateState(STATE_SLASHING_RUNNING, {
                        directionH: h,
                        directionV: v
                    });
                }
                else this.player.updateState(STATE_RUNNING, {
                    directionH: h,
                    directionV: v
                });
            }
            else {
                if (isSlashing) {
                    this.player.updateState(STATE_SLASHING_IDLE, {
                        directionH: h,
                        directionV: v
                    });
                }
                else {
                    this.player.updateState(STATE_WALKING, {
                        directionH: h,
                        directionV: v
                    });
                }
            }
        }
        else if (isSlashing) {
            this.player.updateState(STATE_SLASHING_IDLE);
            // not moving idle
        }
        else
            this.player.updateState(STATE_IDLING);


        this.controlGames();
        this.updateZindex();



    }

    createBossAnimations = () => {
        // bear animation
        this.anims.create({
            key: 'bossIdle',
            frames: this.anims.generateFrameNames('boss', { prefix: 'Potato Idle_', start: 0, end: 13, zeroPad: 2 }),
            frameRate: 24,
            repeat: -1
        })
        this.anims.create({
            key: 'bossAttack',
            frames: this.anims.generateFrameNames('boss', { prefix: 'Potato Attack_', start: 0, end: 16, zeroPad: 2 }),
            frameRate: 24,
        })
        this.anims.create({
            key: 'bossDie',
            frames: this.anims.generateFrameNames('boss', { prefix: 'Potato Die_', start: 0, end: 53, zeroPad: 2 }),
            frameRate: 24,
            // repeat: -1
        })
        this.anims.create({
            key: 'bossWalk',
            frames: this.anims.generateFrameNames('boss', { prefix: 'Potato walk_', start: 0, end: 19, zeroPad: 2 }),
            frameRate: 24,
            repeat: -1
        })
        this.anims.create({
            key: 'bossHurt',
            frames: this.anims.generateFrameNames('boss', { prefix: 'Potato Hurt_', start: 0, end: 9, zeroPad: 2 }),
            frameRate: 24,
            //repeat: -1
        })
    }
    createBearAnimations = () => {
        // bear animation
        this.anims.create({
            key: 'bearIdle',
            frames: this.anims.generateFrameNames('bear', { prefix: 'zombie bear_Idle', start: 0, end: 24, zeroPad: 3 }),
            frameRate: 24,
            repeat: -1
        })
        this.anims.create({
            key: 'bearAttack',
            frames: this.anims.generateFrameNames('bear', { prefix: 'Zombie Bear Attack_', start: 0, end: 24, zeroPad: 3 }),
            frameRate: 24,
        })
        this.anims.create({
            key: 'bearDie',
            frames: this.anims.generateFrameNames('bear', { prefix: 'Dying_', start: 0, end: 36, zeroPad: 3 }),
            frameRate: 24,
            // repeat: -1
        })
        this.anims.create({
            key: 'bearWalk',
            frames: this.anims.generateFrameNames('bear', { prefix: 'Zombie Bear_Walk', start: 0, end: 36, zeroPad: 3 }),
            frameRate: 24,
            repeat: -1
        })
        this.anims.create({
            key: 'bearHurt',
            frames: this.anims.generateFrameNames('bear', { prefix: 'Zombie Bear_Hurt', start: 0, end: 24, zeroPad: 3 }),
            frameRate: 24,
            //repeat: -1
        })
    }
    createPlayerAnimations = (type = ZEPHYR) => {
        this.anims.create({
            key: "Number",
            frames: this.anims.generateFrameNames('numbers', { prefix: '', start: 0, end: 9, zeroPad: 0 }),
            frameRate: 1
        })
        this.anims.create({
            key: type + 'Die',
            frames: this.anims.generateFrameNames(type, { prefix: type + '_Shiba_Dying_', start: 0, end: 14, zeroPad: 3 }),
            frameRate: 24,
            // repeat: -1
        })
        // this.anims.create({
        //     key: type + 'Fall',
        //     frames: this.anims.generateFrameNames(type, { prefix: type + '_Shiba_Falling Down_', start: 0, end: 5, zeroPad: 3 }),
        //     frameRate: 24,
        //     repeat: -1
        // })
        this.anims.create({
            key: type + 'Idle',
            frames: this.anims.generateFrameNames(type, { prefix: type + '_Shiba_Idle Blinking_', start: 0, end: 17, zeroPad: 3 }),
            frameRate: 24,
            repeat: -1
        })
        this.anims.create({
            key: type + 'Hurt',
            frames: this.anims.generateFrameNames(type, { prefix: type + '_Shiba_Hurt_', start: 0, end: 11, zeroPad: 3 }),
            frameRate: 24,

        })
        // this.anims.create({
        //     key: type + 'JumpLoop',
        //     frames: this.anims.generateFrameNames(type, { prefix: type + '_Shiba_Jump Loop_', start: 0, end: 5, zeroPad: 3 }),
        //     frameRate: 24,
        //     repeat: -1
        // })
        // this.anims.create({
        //     key: type + 'Jump',
        //     frames: this.anims.generateFrameNames(type, { prefix: type + '_Shiba_Jump Start_', start: 0, end: 5, zeroPad: 3 }),
        //     frameRate: 24,
        //     repeat: -1
        // })
        this.anims.create({
            key: type + 'Kick',
            frames: this.anims.generateFrameNames(type, { prefix: type + '_Shiba_Kicking_', start: 0, end: 11, zeroPad: 3 }),
            frameRate: 24,
        })
        this.anims.create({
            key: type + 'Run',
            frames: this.anims.generateFrameNames(type, { prefix: type + '_Shiba_Running_', start: 0, end: 11, zeroPad: 3 }),
            frameRate: 24,
            repeat: -1
        })
        this.anims.create({
            key: type + 'RunSlash',
            frames: this.anims.generateFrameNames(type, { prefix: type + '_Shiba_Run Slashing_', start: 0, end: 11, zeroPad: 3 }),
            frameRate: 24,
            // repeat: -1
        })
        this.anims.create({
            key: type + 'Slash',
            frames: this.anims.generateFrameNames(type, { prefix: type + '_Shiba_Slashing_', start: 0, end: 11, zeroPad: 3 }),
            frameRate: 24,
            // repeat: -1
        })
        // this.anims.create({
        //     key: type + 'SlashInAir',
        //     frames: this.anims.generateFrameNames(type, { prefix: type + '_Shiba_Slashing in The Air_', start: 0, end: 11, zeroPad: 3 }),
        //     frameRate: 24,
        //     // repeat: -1
        // })
        this.anims.create({
            key: type + 'Slide',
            frames: this.anims.generateFrameNames(type, { prefix: type + '_Shiba_Sliding_', start: 0, end: 5, zeroPad: 3 }),
            frameRate: 24,

        })
        this.anims.create({
            key: type + 'Walk',
            frames: this.anims.generateFrameNames(type, { prefix: type + '_Shiba_Walking_', start: 0, end: 23, zeroPad: 3 }),
            frameRate: 24,
            repeat: -1
        })
    }
    // createAnimations = (type) => {
    //     this.createPlayerAnimations(type);
    // }

    generateRandomState = () => {

        let states = [STATE_IDLING, STATE_WALKING];
        // return states[~~Math.random() * (states.length + 1)];
        if (Math.random() < 0.1) return STATE_IDLING;
        else return STATE_WALKING;
    }

    controlGames = () => {
        //this.enemies


        for (let i = 0; i < this.enemies.length; i++) {

            if (this.enemies[i].dead == true) {
                this.enemies[i] = null;
                this.enemies.splice(i, 1);
                this.createBear(this.currentLevel);
                continue;
            }
            if (this.enemies[i].currentHp <= 0) {
                this.enemies[i].updateState(STATE_DYING);

                continue;
            }

            let dx = this.getDeltaX(this.player, this.enemies[i]);
            let dy = this.getDeltaY(this.player, this.enemies[i]);
            let h = null;
            let v = null;
            if (dx > this.enemies[i].config.range)
                h = RIGHT;
            if (dx < - this.enemies[i].config.range) h = LEFT;
            else {

                if (dx > 0 && this.enemies[i].direction() == LEFT) {
                    h = RIGHT;
                }
                else if (dx < 0 && this.enemies[i].direction() == RIGHT) {
                    h = LEFT;
                }
            }

            if (dy > DELTA_Y)
                v = DOWN;
            if (dy < -DELTA_Y) v = UP;





            if (Math.abs(dx) <= this.player.config.range && Math.abs(dy) <= DELTA_Y && ((dx > 0 && this.player.direction() == LEFT) || ((dx < 0 && this.player.direction() == RIGHT)))) {
                if (this.player.attacking == true) {
                    this.enemies[i].updateState(STATE_HURTING);
                }
            }


            if (!(h == null && v == null))
                this.enemies[i].updateState(STATE_WALKING, {
                    directionH: h,
                    directionV: v

                });
            else {
                this.enemies[i].updateState(STATE_ATTACKING);
            }
        }

    }

    getDeltaX = (playerA, playerB) => {
        return playerA.x() - playerB.x();
    }
    getDeltaY = (playerA, playerB) => {
        return playerA.y() - playerB.y();
    }

    updateZindex = () => {

        let r = 1;
        for (let i = 0; i < this.enemies.length; i++) {
            r = this.getZindex(this.enemies[i]);
            this.enemies[i].setZindex(3 * r + 1);
        }
        r = this.getZindex(this.player);
        this.player.setZindex(3 * r - 1 + 1);

    }

    getZindex = (obj) => {
        let rank = 1;
        for (let i = 0; i < this.enemies.length; i++) {
            if (obj.y() > this.enemies[i].y() && i != rank)
                rank++;
        }
        return rank;

    }


    createBear = (level) => {
        let x, y, range, speed;
        x = Math.random() * width;
        y = Math.random() * height;
        speed = Math.random() * 30 + 30;
        range = Math.random() * 40 + 60;


        if (this.currentEnemies < MAX_ENEMY + (level == 1 ? 1 : 0))
            this.currentEnemies++;
        else return;

        let newE = null;
        if ((level == 5 && this.currentEnemies == MAX_ENEMY)) {
            newE = new Character(this, {
                type: BOSS,
                direction: LEFT,
                x: x + 4 * width,
                y: y,
                speed: speed * 1.25,
                state: STATE_IDLING,
                scale: 2,
                body_width: 160,
                body_height: 20,
                shadow_width: 140,
                shadow_height: 20,
                offsetX: 50,
                offsetY: 190,
                shadow_x: 130,
                shadow_y: 380,
                range: 200,
                hp: 6,
                currentHp: 6,
            });
            this.levelSound.stop();
            this.bossSound.play();
        }
        else
            newE = new Character(this, {
                type: BEAR,
                direction: RIGHT,
                x: x + (this.currentLevel - 1) * width,
                y: y,
                speed: speed * 1.25,
                state: STATE_IDLING,
                scale: 2,
                body_width: 90,
                body_height: 10,
                shadow_width: 90,
                shadow_height: 15,
                offsetY: 95,
                offsetX: 0,
                shadow_x: 0,
                shadow_y: 190,
                range: range,
                hp: ~~(level) / 2 + 1,
                currentHp: ~~(level) / 2 + 1,
            });
        newE.body.on("attack", (data) => {


            this.bearAttackSound.play();
            let dx = this.player.x() - data.x;
            let dy = this.player.y() - data.y;
            let h = null;
            let v = null;
            if (dx > data.range)
                h = RIGHT;
            if (dx < - data.range) h = LEFT;
            else {

                if (dx > 0 && data.direction == LEFT) {
                    h = RIGHT;
                }
                else if (dx < 0 && data.direction == RIGHT) {
                    h = LEFT;
                }
            }

            if (dy > DELTA_Y)
                v = DOWN;
            if (dy < -DELTA_Y) v = UP;



            if (this.player.config.state != STATE_DYING && Math.abs(dx) <= data.range && Math.abs(dy) <= DELTA_Y && ((dx < 0 && data.direction == LEFT) || ((dx > 0 && data.direction == RIGHT)))) {


                if (this.player.config.currentHp > 1) {
                    this.player.updateState(STATE_HURTING);
                    this.player.config.currentHp--;
                }
                else {
                    this.player.config.currentHp--;
                    // this.ended = true;
                    this.endSound.play();
                    // this.player.updateState(STATE_DYING);
                    this.player.die();
                }
                //console.log("uahh");

            }


        })
        this.enemies.push(newE);
    }



    nextLevel = async () => {
        if (this.currentLevel == 0) {
            this.levelSound.play();
        }

        // this.cameras.main.setPosition(width * level - 1, 0);
        // if (this.currentLevel >= 2) {
        //     this.backImages.forEach((back) => {
        //         this.add.tween({
        //             targets: back,
        //             x: back.x - width,
        //             duration: 3000,
        //             ease: 'Power2',
        //             completeDelay: 3000
        //         });
        //     });
        //     // await sleep(3000);
        // }
        this.currentLevel++;
        for (let i = 0; i < initialEnemey[this.currentLevel - 1]; i++) {
            // setTimeout(() => { }, 1000)            
            this.createBear(this.currentLevel);
            await sleep(1000);
        }

    }

    showGo = (visible) => {
        if (visible) {
            this.go.setAlpha(1);
            // this.cameras.main.startFollow(this.player.body);
        }
        else {
            this.go.setAlpha(0);
            // this.cameras.main.stopFollow();
        }

    }
    canGoLeft = () => {

        if (this.go.alpha == 1) return true;
        if (this.player.x() > this.currentLevel * width - width) return true;
        return false;
    }
    canGoRight = () => {
        if (this.go.alpha == 1) return true;
        if (this.player.x() < this.currentLevel * width) return true;
        return false;
    }



}
export default BattleWeb;