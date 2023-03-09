import Phaser from 'phaser'

export default class Joystick extends Phaser.GameObjects.Sprite {
    constructor({ scene, x, y, holder, pin }) {

        super(scene, x, y, holder);

        this.fixedToCamera = true;

        /* Pin indicator - what players think they drag */
        this.centerX = x;
        this.centerY = y;
        this.pin = scene.add.circle(x, y, 100, 0x00ff00).setAlpha(0.3);
        this.pin.setInteractive(new Phaser.Geom.Circle(this.pin.width / 2, this.pin.height / 2, this.pin.width / 2 - 10), Phaser.Geom.Circle.Contains);
        scene.input.setDraggable(this.pin);
        this.pin.on('pointerdown', () => {

            this.pin.setTint(0x44ff44);
            this.pin.setScale(1.2, 1.2);

        });



        this.pin.on('pointerup', () => {

            this.pin.clearTint();
            this.pin.setScale(1, 1);
            this.pin.setPosition(this.centerX, this.centerY);
            this.emit('dragStopped');
        });

        this.pin.on('pointerout', () => {

            this.pin.clearTint();
            this.pin.setScale(1, 1);
            this.pin.setPosition(this.centerX, this.centerY);
            this.emit('dragStopped');
        });


        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {


            let dx = dragX - this.centerX;
            let dy = dragY - this.centerY;
            let l = Math.sqrt((dx ** 2 + dy ** 2) / 10000);
            if (l != 0 && l >= 1) {
                dx = dx / l;
                dy = dy / l;
            }
            this.emit('mousemove', dx, dy);
            gameObject.x = this.centerX + dx;
            gameObject.y = this.centerY + dy;

        });




        /* Invisible sprite that players actually drag */
        // var dragger = this.dragger = scene.add.sprite(0, 0, null);

        // dragger.width = dragger.height = 181;
        // dragger.inputEnabled = true;

        // /* Set flags on drag */
        // dragger.events.onDragStart.add(this.onDragStart, this);
        // dragger.events.onDragStop.add(this.onDragStop, this);
        // this.addChild(dragger);
    }

}