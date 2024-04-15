"use strict"
window.addEventListener("load",start);
function start(){
    console.log("start");
    createTiles();
    displayTiles();
    setupEventlisteners();
   
  requestAnimationFrame(tick);

}
function setupEventlisteners() {
    document.addEventListener("keydown", (event) => {
    const key=event.key;
     console.log("keypressed: ",key); 
    setControls(key);   
    });
    document.addEventListener("keyup", (event) => {
       const key=event.key; 
       removeControl(key);
    });
}
let lastTimestamp=0;
/*  MODEL   */

const playerobj={
    x: 0,
    y: 0,
    hitbox:{
        x: 4,
        y: 7,
        width: 18,
        height: 17
    },
    regx: 10,
    regy: 12,
    speed:100,
    moving: false,
    direction:undefined
}
const tiles=[
    [0,0,0,0,0,0,4,0,0,2,0,2,2,0,0,1,],
    [0,0,0,1,0,0,0,0,0,2,0,0,2,0,0,1,],
    [0,0,6,6,6,6,6,4,0,2,0,0,2,0,0,1,],
    [0,4,6,0,0,0,6,4,4,2,2,3,2,0,0,1,],
    [6,6,6,0,0,0,6,6,6,6,6,6,6,0,0,1,],
    [0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,1,],
    [5,5,0,4,1,1,4,0,6,0,0,0,0,0,0,1,],
    [5,0,0,1,1,1,1,0,6,0,0,0,0,0,0,1,],
    [5,0,0,4,1,1,4,0,6,0,0,0,0,0,0,1,]
]
const GRID_HEIGHT=tiles.length;
const GRID_WIDTH=tiles[0].length;
const TILE_SIZE=48;
function getTileAtCoord({ row, col }) {
   
    return tiles[row][col];
}
function coordFromPos({x,y}){
    return{
        row:Math.floor(y/TILE_SIZE),
        col:Math.floor(x/TILE_SIZE)
    }

}
function getTilesUnderPlayer(player){
const tilesunderplayer=[];
const topleft={x:player.x-player.regx+player.hitbox.x,y:player.y};
const topright={x:player.x-player.regx+player.hitbox.x+player.hitbox.width+player.hitbox.x,y:player.y};
const bottomleft={x:player.x-player.regx+player.hitbox.x,y:player.y+player.hitbox.height};//tjek herfra
}

function displayPlayerAtPosition(){
    const visualPlayer=document.querySelector("#player");
    visualPlayer.style.transform=`translate(${playerobj.x-playerobj.regx}px, ${playerobj.y-playerobj.regy}px)`;
  // console.log("displayPlayerAtPosition");
 //   console.log(playerobj)
    return true;
}

function tick(timestamp){
  //  console.log("tick");
    requestAnimationFrame(tick);
    
    const deltaTime=(timestamp-lastTimestamp)/1000;
    lastTimestamp=timestamp;
  //  console.log("deltaTime",deltaTime);
    moveplayer(deltaTime);
    displayPlayerAtPosition();
    displayPlayerAnimation();
    showDebugging();
}
const controls={
    up:false,
    down:false,
    left:false,
    right:false
}
 function setControls(key){
    if(key==="ArrowUp"){
        controls.up=true;
    }
    if(key==="ArrowDown"){
        controls.down=true;
    }
    if(key==="ArrowLeft"){
        controls.left=true;
    }
    if(key==="ArrowRight"){
        controls.right=true;
    }
    console.log(controls);
 }
    function removeControl(key){
        if(key==="ArrowUp"){
            controls.up=false;
        }
        if(key==="ArrowDown"){
            controls.down=false;
        }
        if(key==="ArrowLeft"){
            controls.left=false;
        }
        if(key==="ArrowRight"){
            controls.right=false;
        }
        console.log(controls);
    }
function moveplayer(deltaTime){
    playerobj.moving=false;
    const newPos={
        x:playerobj.x,
        y:playerobj.y
    }
    if(controls.up){
        playerobj.moving=true;
        playerobj.direction="up";
        newPos.y-=playerobj.speed*deltaTime;
    }
      if(controls.down){
        playerobj.moving=true;
        playerobj.direction="down";
        newPos.y+=playerobj.speed*deltaTime;
    }
    if(controls.left){
        playerobj.moving=true;
        playerobj.direction="left";
        newPos.x-=playerobj.speed*deltaTime;
    }  if(controls.right){
        playerobj.moving=true;
        playerobj.direction="right";
        newPos.x+=playerobj.speed*deltaTime;
    }
    if(validposition(newPos)){
        playerobj.x=newPos.x;
        playerobj.y=newPos.y;
    }
}
function validposition(pos){
    const {row,col}=coordFromPos(pos);
    if(row<0 || col<0 || row>=GRID_HEIGHT || col>=GRID_WIDTH){
        return false;
    }
    const tileType=getTileAtCoord({row,col});
    switch(tileType){
        case 0:
        case 6:
        case 3:
            return true;
            break;
        case 1:
        case 2:
        case 4:
        case 5:
            return false;
            break;
    }
    return true;
}


   


/*  VIEW   */
function displayPlayerAnimation(){
  //  console.log("displayPlayAnimation");
    const visualPlayer=document.querySelector("#player");
    if(playerobj.moving){
        visualPlayer.classList.add("animate");
        visualPlayer.classList.remove("up","down","left","right");
        visualPlayer.classList.add(playerobj.direction);
    } else{
        visualPlayer.classList.remove("animate");
     
    }

}
function createTiles(){
    const background=document.querySelector("#background");
 for(let i=0;i<GRID_HEIGHT;i++){
     for(let j=0;j<GRID_WIDTH;j++){
        const tile=document.createElement("div");
         tile.classList.add("tile");
         background.appendChild(tile);
     }
 }
 background.style.setProperty("--GRID_WIDTH",GRID_WIDTH);
 background.style.setProperty("--GRID_HEIGHT",GRID_HEIGHT);
 background.style.setProperty("--TILE_SIZE",TILE_SIZE+"px")
}
 function displayTiles(){
const visualTiles=document.querySelectorAll("#background .tile");
for(let row=0;row<GRID_HEIGHT;row++){
    for(let col=0;col<GRID_WIDTH;col++){
      const modelTile=getTileAtCoord({row,col});
      const  visualTile=visualTiles[row*GRID_WIDTH+col];
        visualTile.classList.add(getClassForTileType(modelTile))
    }
}
 }
 function getClassForTileType(tileType){
     switch(tileType){
         case 0:
             return "grass";
             break;
         case 1:
             return "water";
             break;
         case 2:
             return "wall";
             break; 
        case 3:
            return "door";
            break;
        case 4:
            return "tree";
            break;
        case 5:
            return "cliff";
            break;
        case 6:
            return "path";
            break;
         default:
             return "grass";
             break;
     }
 }
//#region DEBUGGING
function showDebugging(){
    showDebugTileUnderplayer();
    showDebugPlayerRect();
    showDebugPlayerRegistrationPoint();
}
let lastPlayerCoord={row:0,col:0};
function showDebugTileUnderplayer(){
    const coord=coordFromPos(playerobj);
    if(coord.row!==lastPlayerCoord?.row || coord.col!==lastPlayerCoord?.col){
        unhighlightTile(lastPlayerCoord);
   highlightTile(coord);
    }
    lastPlayerCoord=coord;
}
function showDebugPlayerRect(){
    const visualPlayer=document.querySelector("#player");
   if(!visualPlayer.classList.contains("show-rect")){
    visualPlayer.classList.add("show-rect");
   }
}
function showDebugPlayerRegistrationPoint(){
    const visualPlayer=document.querySelector("#player");
   if(!visualPlayer.classList.contains("show-regpoint")){
    visualPlayer.classList.add("show-regpoint");
   }
   visualPlayer.style.setProperty("--regx",playerobj.regx+"px");
    visualPlayer.style.setProperty("--regy",playerobj.regy+"px");
}

function highlightTile( {row,col}){
const visualTiles=document.querySelectorAll("#background .tile");
const visualTile=visualTiles[row*GRID_WIDTH+col];
visualTile.classList.add("highlight");
}
function unhighlightTile(cord){
const visualTiles=document.querySelectorAll("#background .tile");
const visualTile=visualTiles[cord.row*GRID_WIDTH+cord.col];
visualTile.classList.remove("highlight");
}

//#endregion