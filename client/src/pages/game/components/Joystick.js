import Phaser from 'phaser'

export default class Joystick extends Phaser.GameObjects.Sprite {
    constructor({ scene, x, y, holder, pin, delta }) {

        super(scene, x, y, holder);

        this.fixedToCamera = true;
        this.scene = scene;
        this.delta = delta;


        this.prevX = 0;
        /* Pin indicator - what players think they drag */
        this.centerX = x;
        this.centerY = y;
        scene.physics.add.sprite(x, y, "pinBack", 0).setOrigin(0.5, 0.5).setDepth(9999).setScale(0.3, 0.3).setScrollFactor(0);
        this.pin = scene.physics.add.sprite(x, y, pin, 0).setOrigin(0.5, 0.5).setDepth(9999).setScale(0.4, 0.4);
        this.pin.setScrollFactor(0);
        this.pin.setInteractive(new Phaser.Geom.Circle(this.pin.width / 2, this.pin.height / 2, this.pin.width / 2 - 10), Phaser.Geom.Circle.Contains);

        scene.input.setDraggable(this.pin);
        this.pin.on('pointerdown', () => {

            // this.pin.setTint(0x44ff44);
            this.pin.setScale(0.6, 0.6);
            this.prevX = this.scene.cameras.main.midPoint.x;
        });



        this.pin.on('pointerup', () => {

            this.pin.clearTint();
            this.pin.setScale(0.4, 0.4);
            this.pin.setPosition(this.centerX, this.centerY);
            this.emit('dragStopped');
        });

        this.pin.on('pointerout', () => {

            this.pin.clearTint();
            this.pin.setScale(0.4, 0.4);
            this.pin.setPosition(this.centerX, this.centerY);
            this.emit('dragStopped');
        });


        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {


            // console.log(this.scene.cameras.main.midPoint.x, delta);
            // console.log(this.scene.cameras.main);


            let d = this.scene.cameras.main.midPoint.x - this.prevX;


            // d = 0;
            let dx = dragX - this.centerX - d;
            let dy = dragY - this.centerY;


            console.log(d, this.scene.cameras.main);



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