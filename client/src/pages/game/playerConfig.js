export const BEAR = "bear";
export const PLAYER = "player";
export const BOSS = "boss";
export const SKEL1 = "skel1";
export const SKEL2 = "skel2";

export const ZEPHYR = "Zephyr";
export const FIRE = "Fire";
export const LIGHTNING = "Lightning"
export const SHIBA = "Shiba"


export const STATE_ATTACKING_SIDE = "attacking side";
export const STATE_WAITING = "waiting for states";
export const STATE_WALKING = "walking";
export const STATE_IDLING = "idling";
export const STATE_DYING = "dying";
export const STATE_RUNNING = "running";
export const STATE_JUMPING_START = "jumping start";
export const STATE_FALLING = "falling";
export const STATE_KICKING = "kick";
export const STATE_SLASHING_IDLE = "slashing idle";
export const STATE_SLASHING_RUNNING = "slashing running";
export const STATE_SLASHING_AIR = "slashing air";
export const STATE_SLIDING = "sliding";
export const STATE_DEAD = "dead";
export const STATE_HURTING = "hurting";

//enemies
export const STATE_ATTACKING = "attacking";


export const LEFT = "left";
export const RIGHT = "right";
export const UP = "up";
export const DOWN = "down";

export const MAX_ENEMY = 7;

export const DELTA_X = 10; // range
export const DELTA_Y = 2;

// export const PLAYER_ANIMATION ={
//     "Die":"_Shiba_Dying_",
//     "Fall":"_Shiba_Falling Down_",
//     "Idle":"_Shiba_Dying_",
//     "Hurt":"_Shiba_Dying_",
//     "JumpLoop":"_Shiba_Dying_",
//     "Jump":"_Shiba_Dying_",
//     "Kick":"_Shiba_Dying_",
//     "Run":"_Shiba_Dying_",
//     "RunSlash":"_Shiba_Dying_",
//     "Slash":"_Shiba_Dying_",
//     "SlashInAir":"_Shiba_Dying_",
//     "Die":"_Shiba_Dying_",
//     "Die":"_Shiba_Dying_",
// }

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}