import {Player_I} from '../objects/Player_I.js'
import { Skull } from '../objects/Skull.js'
import { Trampa } from '../objects/Trampa.js'
import {GamepadProcessor} from "../util/InputProcessors/GamepadProcessor.js";
import {KeyboardProcessor} from "../util/InputProcessors/KeyboardProcessor.js";
import {Platform} from "../objects/Platform.js";
import {Timer} from "../util/Timer.js";

var players = [];
var skulls = [];
var traps = [];
var bump;
var scores = [];
var counter = 0;

export class Comp3 extends Phaser.Scene{

    constructor() {
        super("Comp3");
    }

    init(){
        this.timer= new Timer(this,60000,()=>console.log("completed"))
    }

    preload(){
        }

    create(data){

        this.game.canvas.width = (960);
        this.physics.world.setBounds(0, 0, this.game.canvas.width, this.game.canvas.height);

        const map = this.make.tilemap({ key: 'Comp3Map'});
        const tileset = map.addTilesetImage('Tileset', 'tileset');

        map.createStaticLayer('Background', tileset);
        const floor = map.createStaticLayer('Level', tileset);
        
        this.platforms=[]
        var platform1= new Platform(this, 64 * 2, 64*4, 'platM', 0, 0)
        this.platforms.push(platform1)
        var platform2= new Platform(this, 64 * 4, 64*6, 'platL', 0, 0)
        this.platforms.push(platform2)
        var platform3= new Platform(this, 64 * 6, 64*4, 'platL', 0, 0)
        this.platforms.push(platform3)
        var platform4= new Platform(this, 64 * 9, 64*6, 'platM', 0, 0)
        this.platforms.push(platform4)
        var platform5= new Platform(this, 64 * 11, 64*4, 'platL', 0, 0)
        this.platforms.push(platform5)
        var platform6= new Platform(this, 64 * 13, 64*6, 'platL', 0, 0)
        this.platforms.push(platform6)
        var platform7= new Platform(this, 64 * 16, 64*4, 'platM', 0, 0)
        this.platforms.push(platform7)


        floor.setCollisionByProperty({ collides: true });

        var player1 = new Player_I(this, 0, 192, "dude");
        player1.setPlayerInput(new KeyboardProcessor(this,player1,'W',0,'A','D', 'S', 'F'));
        players[0] = player1;
        var player2 = new Player_I(this, 0, 192, "dude2");
        player2.setPlayerInput(new KeyboardProcessor(this,player2,'U',0,'H','K', 'J', 'L'));
        players[1] = player2;
        players[0].puntos = data.jug1;
        players[1].puntos = data.jug2;

        this.physics.add.collider(players[0], players[1], function(){
            bump = true;
        });
        
        this.physics.add.collider(players[0], floor);
        this.physics.add.collider(players[1], floor);

        //Creación de todas las skulls
        skulls.push(new Skull(this, 200, 165, "skull"));
        skulls.push(new Skull(this, 290, 325, "skull"));
        skulls.push(new Skull(this, 330, 430, "skull"));
        skulls.push(new Skull(this, 450, 300, "skull"));

        skulls.push(new Skull(this, 580, 180, "skull"));
        skulls.push(new Skull(this, 600, 300, "skull"));
        skulls.push(new Skull(this, 630, 430, "skull"));

        skulls.push(new Skull(this, 930, 300, "skull"));
        skulls.push(new Skull(this, 930, 165, "skull"));
        skulls.push(new Skull(this, 930, 420, "skull"));

        counter = 10;

        for (let i = 0; i < skulls.length; i += 1) {
            this.physics.add.collider(players[0], skulls[i], function () {
                skulls[i].desaparicion(players[0]);
                scores[0].setText("Jugador 1: " + players[0].points);
                counter--;
            });
            this.physics.add.collider(players[1], skulls[i], function () {
                skulls[i].desaparicion(players[1]);
                scores[1].setText("Jugador 2: " + players[1].points);
                counter--;
            });
        }

        traps.push(new Trampa(this, 150, 426, "trap"));
        traps.push(new Trampa(this, 300, 554, "trap"));
        traps.push(new Trampa(this, 350, 554, "trap"));
        traps.push(new Trampa(this, 615, 554, "trap"));
        traps.push(new Trampa(this, 665, 554, "trap"));
        traps.push(new Trampa(this, 930, 554, "trap"));

        for (let i = 0; i < traps.length; i += 1) {
            this.physics.add.collider(players[0], traps[i], function () {
                traps[i].dañar(players[0]);
                scores[0].setText("Jugador 1: " + players[0].points);
            });
            this.physics.add.collider(players[1], traps[i], function () {
                traps[i].dañar(players[1]);

                scores[1].setText("Jugador 2: " + players[1].points);
            });
        }

        scores[0] = this.add.text(30, 0, "Jugador 1: "+ players[0].puntos);
        scores[1] = this.add.text(735, 0, "Jugador 2: "+ players[1].puntos);

        this.addStageFloorCollisions(floor);

        this.setPlatformsColliders();

      this.timer.startTimer();
        this.timerText= this.add.text(this.game.config.width *0.5, 20,'test');


        console.log("Escena comp 3 creada");
    }

    update(){
        players[0].update(bump, players[1]);
        players[1].update(bump, players[0]);
        bump = false;
        this.timerText.setText(this.timer.getRemainingSeconds(true));
        this.UpdatePlatforms();
        if (counter == 0) {
            this.scene.start("FinPartida+", { jug1: players[0].points, jug2: players[1].points });
        }
    }

    setPlatformsColliders(){

        for (let i = 0; i < this.platforms.length; i++) {
            this.physics.add.collider(players[0],  this.platforms[i],()=>console.log("over platform" ))
            this.physics.add.collider(players[1],  this.platforms[i],()=>console.log("over platform" ))
        }
    }

    addStageFloorCollisions(floor) {
        this.physics.add.collider(players[0], floor);
        this.physics.add.collider(players[1], floor);
    }



    UpdatePlatforms(){
        for (let i = 0; i < this.platforms.length; i++) {
            this.platforms[i].movePlatform()
        }
    }
}