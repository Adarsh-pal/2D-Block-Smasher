const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const Alert = document.getElementById('alert');
const elScore = document.getElementById("score");
const elMsg = document.getElementById("msg");
const elClose = document.getElementById("close");
const container = document.getElementById("container");
const play = document.getElementById("play");
const gamepad= document.getElementById("gamepad");
const audBounce = document.getElementById("audBounce");
const toggle= document.querySelector(".toggle");
const toggleSwitch= document.querySelector(".switch");
const dot= document.querySelector(".dot");

const barWidth = 150;
const barHeight = 20;
const barMargin = 80;
const ballRadius = 25;
ctx.lineWidth = 12;

let youWin = false;
let bounce = 0;
let leftArrow = false;
let rightArrow = false;
let stopAnimating = false;
let level = 1;
let column = level+2;
let rows = level+1;
let elArray = [];
let col = 0;
let life = 3;
let broke = false;
let textColor = "black";
let round=1;
let list2 = document.getElementById("list2");
let elStats = document.getElementById("stats");
let style1 = window.getComputedStyle(elStats);
let value = style1.getPropertyValue("height");
let ht = parseFloat(value.substring(0,value.length-2));
let blocks = [];


function script(){

  function home(){
  
     ctx.font = "100px Reggae-One";
     ctx.fillStyle = "red";
     ctx.fillText("2D  BLOCK",150,150);
     ctx.fillStyle = "yellow";
     ctx.fillText("SMASHER",160,300);
     ctx.drawImage(imgWall,canvas.width/2-250,360,500,300);
     ctx.font = "20px arial";
     ctx.fillStyle = "black";

     ctx.fillText("press ENTER to start a NEW GAME",230,350);

   }
   home();

function stats(score){
  let newEl = document.createElement("div");
  let newSpan1 = document.createElement("span");
  let newSpan2 = document.createElement("span");
  let newtxt1 = document.createTextNode(round);
  let newtxt2 = document.createTextNode(score);
  newSpan1.appendChild(newtxt1);
  newSpan2.appendChild(newtxt2);
  newSpan2.style.float= "right";
  newEl.appendChild(newSpan1);
  newEl.appendChild(newSpan2);
  list2.appendChild(newEl);
  ht += 43;
 round++;
elStats.style.height = ht+"px";

}

const bar = {
  x: canvas.width/2- barWidth/2,
  y: canvas.height-barHeight-barMargin,
  width: barWidth,
  height: barHeight,
  dx: 10,
  margin: barMargin,
}

function drawBar(){
  ctx.fillStyle = "rgb(26, 221, 110)"
  ctx.fillRect(bar.x,bar.y,bar.width,bar.height);
  ctx.fill();
  
}

function barMove(){
  
  if(rightArrow && (bar.width + bar.x)< canvas.width )
  {
     bar.x += bar.dx;

  }
  else if(leftArrow && bar.x>0 )
  {
     bar.x -= bar.dx;

  }
}

let ball = {
  x: canvas.width/2,
  y: bar.y-ballRadius,
  radius: ballRadius,
  dx: 5,
  dy: 5,
  fillColor: "yellow",
  speed: 5,
}

function drawBall(){
  ctx.beginPath();
  ctx.fillStyle = ball.fillColor;
  ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2);
  ctx.strokeStyle = "red";
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
}


function moveBall(){
  ball.x += ball.dx;
  ball.y -= ball.dy;
}

function wallCollison(){
  if(ball.x + ball.radius > canvas.width ||  ball.x - ball.radius < 0)
  {
  
    ball.dx *= -1;

  }
  if( ball.y - ball.radius < 0)
  {
  
    ball.dy *= -1;
   

  }
  if(ball.y + ball.radius > canvas.height)
  { 
    
    --life;
    score();
    if(life>=1){
      ctx.drawImage(imgBroken,20,10,50,40);
      audYouLose.play();

    }
    broke= true;
  }
}

function barCollision(){
  if(ball.x+ball.radius>bar.x && ball.x-ball.radius < bar.x+bar.width && ball.y+ball.radius>bar.y && ball.y-ball.radius<bar.y+bar.height)
  {
    let collidePoint = ball.x-(bar.x+bar.width/2);
    collidePoint = collidePoint/(bar.width/2);

    let angle = collidePoint*(Math.PI/3);
    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = ball.speed * Math.cos(angle);
    bounce++;
    audBounce.play();
  }
}

const block = {
  row: 2,
  col: 3,
  width: 100,
  height: 30,
  offSetLeft: 125,
  offSetTop: 40,
  marginTop: 80,
  fillColor: "white",
}

function createBlocks(){

 for(let r = 0; r<block.row; r++)
 {    blocks[r] = [];
   for(let c = 0; c<block.col; c++)
   {
     blocks[r][c] = {
       x: c*(block.offSetLeft+block.width) + block.offSetLeft,
       y: r*(block.offSetTop+block.height) + block.marginTop,
       status: true,

     }
   }
 }
}

createBlocks();

function drawBlocks(){
  for(let r = 0; r<block.row; r++)
  { 
    for(let c = 0; c<block.col; c++)
    { let b = blocks[r][c];
      if(b.status){
        ctx.fillStyle = block.fillColor;
        ctx.fillRect(b.x,b.y,block.width,block.height);

      }
    }
  }
}

function blockCollision(){
  for(let r = 0; r<block.row; r++)
  { 
    for(let c = 0; c<block.col; c++)
    { let b = blocks[r][c];
      if(b.status){
        if(ball.x+ball.radius>b.x && ball.x-ball.radius < b.x+block.width && ball.y+ball.radius>b.y && ball.y-ball.radius<b.y+block.height)
        {
          ball.dy *= -1;
          b.status = false;
          col++;
          audBreak.play();
        }
      
      }
    }
  }      
}
function image(){
  ctx.drawImage(imgLive,20,10,50,40);
  ctx.drawImage(imgLevel,canvas.width/2-55,5,50,50);


  ctx.font = "40px arial";
  ctx.fillStyle = textColor;
  ctx.fillText(life,80,45);
  ctx.fillText(level,canvas.width/2+5,45);
}



function draw(){
  image();
 drawBar();
 drawBall();
 drawBlocks();

}

function update(){
  barMove();
  moveBall();
  wallCollison();
  barCollision();
  blockCollision();
  if(col>=block.row*block.col)
  { 
    if(level==3){
      youWin = true;
      audWin.play();
    }
    else{
      audLevelWin.play();
    }
    score();
    level++;
    if(level ==2){
      imgBackground.src = "images/space.jpg";
      textColor = "white";
      ball.fillColor = "white";
      block.fillColor = "yellow";
    }
    else{
      imgBackground.src = "images/sea.jpg";
      block.fillColor = "navy";
      ball.fillColor = "yellow";
      textColor = "black";
    }
    ball.speed *= 1.40;
    bar.dx -= 2; 
    block.row++;
    block.col++;
    block.offSetLeft = (canvas.width-block.col*100)/(block.col+1);
  }
}
function gameplay(){
  ctx.drawImage(imgBackground,0,0,canvas.width,canvas.height);
    draw();
    update();

    if(!stopAnimating){
    
      requestAnimationFrame(gameplay);

    }
}

document.addEventListener("keydown",(event)=>{

if(event.key == "ArrowRight")
{
  rightArrow = true;
  
}
if(event.key == "ArrowLeft")
{
   leftArrow = true;
}
if(event.key == "Enter"){
  gameplay();
  play.style.display = "none";
}

},false);

play.onclick = ()=>{
  if(window.innerWidth<=768){
    gamepad.requestFullscreen();
    screen.orientation.lock("landscape-primary");
  }
  gameplay();
  play.style.display = "none";
}

document.addEventListener("keyup",(event)=>{
  if(event.key == "ArrowRight")
  {
    rightArrow = false;
    
  }
  if(event.key == "ArrowLeft")
  {
     leftArrow = false;
  }
},false);


elClose.onclick = ()=>{
 if(life<1 || youWin == true)
 {

   location.reload();
 }
 else{
  Alert.style.display = "none";
  bounce =0;
  col = 0;
  blocks.length = 0;

  createBlocks();

  for(let r = 0; r<block.row-1; r++)
  { 
   for(let c = 0; c<block.col-1; c++)
   {
     if(!blocks[r][c].status)
     {
       blocks[r][c].status = true;
     }
   }
  }

   ball.x = canvas.width/2;
   ball.y = 450;
   elClose.style.display = "none";
   elScore.style.display = "none";
   elMsg.style.display = "none";
   bar.x = canvas.width/2- barWidth/2;
   broke = false;
   stopAnimating = false;
   gameplay();
   
 } 
}

function score()
{   

     Alert.style.display = "block";
     elScore.textContent = col*100+bounce*50;
      if(elScore.textContent<0)
      {
        elScore.textContent=0;
      }
      stats(elScore.textContent);

     setTimeout(()=>{
     elScore.style.display = "block";
     elMsg.style.display = "block";
     elClose.style.display = "block";
     ball.dy = -1*ball.dy;

      },500);
      console.log(life);

     if(youWin==true){
      Alert.style.top = "80%";
       ctx.drawImage(imgWin,0,0,canvas.width,canvas.height);
     }
     else if(life<1){
      Alert.style.top = "70%";
      ctx.drawImage(imgYoulose,0,0,canvas.width,canvas.height);
      audGameLose.play();

     }
     stopAnimating = true;



}
}
window.addEventListener("load",()=>{
  script();
},false);

toggleSwitch.onclick = ()=>{
    toggle.style.backgroundColor = "white";
    if(dot.classList.contains("transition2")){
      dot.classList.remove("transition2");
    }
    dot.classList.add("transition1");
    setTimeout(()=>{
      gamepad.requestFullscreen();
      screen.orientation.lock("landscape-primary");
    },500);
  
};


if (document.addEventListener)
{
 document.addEventListener('fullscreenchange', exitHandler, false);
 document.addEventListener('mozfullscreenchange', exitHandler, false);
 document.addEventListener('MSFullscreenChange', exitHandler, false);
 document.addEventListener('webkitfullscreenchange', exitHandler, false);
}

function exitHandler()
{
  toggle.style.backgroundColor = "black";
  dot.classList.remove("transition1");
  dot.classList.add("transition2");
}

canvas.addEventListener("touchstart",(event)=>{
  if(event.touches[0].pageX < canvas.offsetWidth/2)
  
  {
  
    leftTouch = true;
  
  }
  
  if(event.touches[0].pageX > canvas.offsetWidth/2)
  
  {
    rightTouch = true;
  }
  
  },false);
  
  canvas.addEventListener("touchend",(event)=>{
  
    if(event.changedTouches[0].pageX < canvas.offsetWidth/2)
  
  {
  
    leftTouch = false;
  
    
  
  }
  
  if(event.changedTouches[0].pageX > canvas.offsetWidth/2)
  
  {
  
    rightTouch = false;
  
  }
  
  },false);
