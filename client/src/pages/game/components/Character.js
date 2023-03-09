import Phaser from "phaser";
import { BOSS, ZEPHYR, FIRE, STATE_SLIDING, BEAR, PLAYER, SKEL1, SKEL2 } from "../playerConfig";
import { } from "../playerConfig";
import { STATE_ATTACKING, STATE_IDLING, STATE_WALKING, STATE_DYING, STATE_WAITING, STATE_HURTING, STATE_KICKING, STATE_RUNNING, STATE_SLASHING_IDLE, STATE_SLASHING_RUNNING, STATE_ATTACKING_SIDE } from '../playerConfig';
import { LEFT, RIGHT, UP, DOWN } from '../playerConfig';


class Character {

    constructor(scene, config) {

        this.scene = scene;

        this.config = { ...config };

        this.dead = false;


        this.shadow = this.scene.add.ellipse(config.x + config.shadow_x, config.y + config.shadow_y, config.shadow_width, config.shadow_height, "#000000", 0.7).setOrigin(0, 0).setScale(config.scale, config.scale);

        this.body = this.scene.physics.add.sprite(config.x, config.y, config.type, 0).setScale(config.scale, config.scale).setOrigin(0, 0);

        // if (this.config.type == SKEL1 || this.config.type == SKEL2)
        //     this.body.setOrigin(0.5, 0.5);
        this.body.setCollideWorldBounds(true);




        this.body.setBodySize(config.body_width, config.body_height, false);
        this.body.setBodySize(config.body_width, config.body_height, false);
        this.body.body.setOffset(config.offsetX, config.offsetY);


        this.attacking = false;


        //event

        this.body.on("animationcomplete", ({ key }) => {
            console.log('animation', key);
            if (key == this.config.type + "Hurt") {

                if (this.config.currentHp == 0) {
                    this.die();
                }
                else {

                    this.setState(STATE_WAITING);
                }
            }
            else if (key == this.config.type + "Die") {
                this.dead = true;
                this.body.emit("die", { ...this.config });
                if (this.config.type != PLAYER) {
                    this.body.destroy();
                    this.shadow.destroy();
                }

            }
            else {
                this.setState(STATE_WAITING);
                // this.body.setOrigin(0, 0);
            }

        })




    }
    setState = (state) => {
        this.config.state = state;
    }
    setVelocity = (x = 0, y = 0) => {
        this.body.setVelocity(x, y);
    }

    slideMove = () => {
        let d = this.config.direction;
        if (this.body.flipX == true) {
            if (d == LEFT) d = RIGHT;
            else d = LEFT;
        }
        this.movePosition(d, null, 12);
    }

    movePosition = (directionH, directionV, rate = 1) => {
        this.setVelocity(0, 0);
        let s = rate * this.config.speed
        if (directionV != null) {
            if (directionV == UP) {
                this.body.setVelocityY(-s);
            }


            else if (directionV == DOWN) {
                this.body.setVelocityY(s);
            }
        }
        if (directionH != null) {

            if (directionH != this.config.direction) {
                this.body.setFlipX(true);

            }
            else {
                this.body.setFlipX(false);
            }

            if (directionH == LEFT) this.body.setVelocityX(-s);
            if (directionH == RIGHT) this.body.setVelocityX(s);
        }
    }

    /// animations
    idle = () => {
        console.log(this.config.type);
        this.body.play(this.config.type + "Idle")
        this.body.setVelocity(0);
        this.setState(STATE_IDLING);


    }

    slide = () => {


        this.body.play(this.config.type + "Slide")
        this.body.setVelocity(0);
        // this.body.setOrigin(1, 0.5);
        this.setState(STATE_SLIDING)
        this.slideMove();
    }
    hurt = () => {
        this.body.play(this.config.type + "Hurt")
        this.body.setVelocity(0);
        this.setState(STATE_HURTING)
    }

    jump = () => {

    }

    die = () => {
        this.body.play(this.config.type + "Die")

        this.setState(STATE_DYING);
    }

    walk = () => {
        this.body.play(this.config.type + "Walk");
        this.setState(STATE_WALKING);
    }
    run = () => {
        this.body.play(this.config.type + "Run");
        this.setState(STATE_RUNNING);
    }

    kick = () => {
        this.body.play(this.config.type + "Kick");
        this.setVelocity(0, 0);
        this.setState(STATE_KICKING);
    }
    slashIdle = () => {
        this.body.play(this.config.type + "Slash");
        this.setVelocity(0, 0);

        // this.setAttackFlag(3, 6);
        this.emitAttack(3);
        this.setState(STATE_SLASHING_IDLE);
    }

    slashRun = () => {
        this.body.play(this.config.type + "RunSlash");

        // this.setAttackFlag(3, 6);
        this.emitAttack(3);
        this.setState(STATE_SLASHING_RUNNING);
    }

    // =======
    setAttackFlag = (st, en) => {
        setTimeout(() => {
            this.attacking = true;
        }, st * 1000 / 24);
        setTimeout(() => {
            this.attacking = false;
        }, en * 1000 / 24);
    }

    // ======= 
    reduceHp = (hp) => {
        this.config.hp -= hp;
        if (this.config.hp == 0) {
            this.emit("dead");
        }

    }
    //======================================================================
    attack = () => {
        //13~18
        this.body.play(this.config.type + "Attack");
        this.setVelocity(0, 0);
        // this.setAttackFlag(14, 18);
        this.emitAttack(14);
        this.setState(STATE_ATTACKING);
    }

    attackSide = () => {
        //13~18
        this.body.play(this.config.type + "AttackSide");
        this.setVelocity(0, 0);
        // this.setAttackFlag(14, 18);
        this.emitAttackSide(14);
        this.setState(STATE_ATTACKING);
    }

    emitAttackSide = (st) => {
        setTimeout(() => {
            this.body.emit("attackSide", {
                x: this.x(),
                y: this.y(),
                range: this.config.range,
                direction: this.direction(),
            });
        }, st * 1000 / 24)
    }

    emitAttack = (st) => {
        setTimeout(() => {
            this.body.emit("attack", {
                x: this.x(),
                y: this.y(),
                range: this.config.range,
                direction: this.direction(),
            });
        }, st * 1000 / 24)
    }





    updateState = (state, data) => {
        // console.log(this.config.type, state);
        if (this.config.state == STATE_DYING) return;
        switch (state) {

            case STATE_IDLING:
                if (this.config.state == STATE_WAITING || this.config.state == STATE_RUNNING || this.config.state == STATE_WALKING)
                    this.idle();
                break;
            case STATE_WALKING:
                if (this.config.state == STATE_WAITING || this.config.state == STATE_IDLING || this.config.state == STATE_RUNNING)
                    this.walk();
                if (this.config.state == STATE_WALKING) this.movePosition(data.directionH, data.directionV);

                break;
            case STATE_RUNNING:
                if (this.config.state == STATE_WAITING || this.config.state == STATE_IDLING || this.config.state == STATE_WALKING)
                    this.run();
                if (this.config.state == STATE_RUNNING) this.movePosition(data.directionH, data.directionV, 2);
                break;
            case STATE_SLASHING_IDLE:
                if (this.config.state == STATE_WAITING || this.config.state == STATE_IDLING || this.config.state == STATE_WALKING)
                    this.slashIdle();
                break;
            case STATE_SLASHING_RUNNING:
                if (this.config.state == STATE_WAITING || this.config.state == STATE_IDLING || this.config.state == STATE_RUNNING || this.config.state == STATE_WALKING) {
                    this.slashRun();
                }
                this.movePosition(data.directionH, data.directionV, 2);
                break;
            case STATE_KICKING:
                if (this.config.state == STATE_WAITING || this.config.state == STATE_IDLING || this.config.state == STATE_RUNNING || this.config.state == STATE_WALKING) {
                    this.kick();
                }
                break;
            case STATE_HURTING:
                if (this.config.state != this.STATE_DYING && this.dead == false) {
                    this.hurt();
                }
                //hurt
                break;
            case STATE_SLIDING:
                if (this.config.state == STATE_IDLING || this.config.state == STATE_RUNNING || this.config.state == STATE_WALKING) {
                    this.slide();
                }
                break;
            case STATE_ATTACKING:
                if (this.config.state == STATE_WAITING || this.config.state == STATE_IDLING || this.config.state == STATE_WALKING)
                    this.attack();
                break;
            case STATE_ATTACKING_SIDE:
                if (this.config.state == STATE_WAITING || this.config.state == STATE_IDLING || this.config.state == STATE_WALKING)
                    this.attackSide();
                break;

        }
        this.shadow.setPosition(this.body.x + this.config.shadow_x, this.body.y + this.config.shadow_y);
    }

    setZindex = (index) => {
        this.body.setDepth(index);
        this.shadow.setDepth(index - 1);
    }

    x = () => {
        if (this.dead == true) return 0;
        return this.body.body.x + this.body.body.width / 2;
    }
    y = () => {
        if (this.dead == true) return 0;
        return this.body.body.y + this.body.body.height / 2;
    }
    direction = () => {
        if (this.body.flipX == false) return this.config.direction;
        else {
            if (this.config.direction == LEFT) return RIGHT;
            else return LEFT;

        }
    }
}

export default Character;
