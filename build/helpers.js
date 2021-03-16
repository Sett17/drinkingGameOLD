function isMobile(){let hasTouchScreen=false
if('maxTouchPoints'in navigator){hasTouchScreen=navigator.maxTouchPoints>1}else if('msMaxTouchPoints'in navigator){hasTouchScreen=navigator.msMaxTouchPoints>1}else{var mQ=window.matchMedia&&matchMedia('(pointer:coarse)')
if(mQ&&mQ.media==='(pointer:coarse)'){hasTouchScreen=!!mQ.matches}else if('orientation'in window){hasTouchScreen=true}}
return hasTouchScreen}
function loadCSS(cssURL){return new Promise(function(resolve,reject){var link=document.createElement('link');link.rel='stylesheet';link.href=cssURL;document.head.appendChild(link);link.onload=function(){resolve();console.log('CSS has loaded!');};});}
class Session extends Map{set(id,value){if(typeof value==='object')value=JSON.stringify(value)
sessionStorage.setItem(id,value)}
get(id){const value=sessionStorage.getItem(id)
try{return JSON.parse(value)}catch(e){return value}}}
function coerce(num,min,max){if(num<min){return min}else if(num>max){return max}else{return num}}
function mapRange(inp,inpStart,inpEnd,outpStart,outpEnd){return outpStart+((outpEnd-outpStart)/(inpEnd-inpStart))*(inp-inpStart)}
let oriX=0,oriY=0,dX=0,dY=40,offsetX=0,offsetY=40,angle=0
let isMoving=false
function handleDragStart(e){document.querySelector('#card').style.transition=`all ${turnTime}ms`
dX=0
dY=0
if(!isMoving){oriX=e.touches[0].clientX
oriY=e.touches[0].clientY}}
const animTimeRet=100
const animTimeBounce=80
const animTimeOut=150
const animTimeDef=150
let animTimeIn=100
if(isMobile){animTimeIn=250}
function handleDragEnd(e){let zoneSize=[document.body.clientWidth*0.3,document.body.clientHeight*0.33]
if(dX<zoneSize[0]&&dX>-zoneSize[0]&&dY<zoneSize[1]){document.querySelector('#play-name').style.opacity=1.0
isMoving=true
document.querySelector('#card').style.transition=`all ${animTimeRet}ms`
document.querySelector('#card').style.transform=getMatrix(0,-Math.sign(dX)*15,-Math.sign(dY)*15+offsetY)
setTimeout(()=>{document.querySelector('#card').style.transition=`all ${animTimeBounce}ms`
document.querySelector('#card').style.transform=getMatrix(0,0,offsetY)
setTimeout(()=>{isMoving=false
document.querySelector('#card').style.transition=`all ${turnTime}ms`},animTimeBounce)},animTimeRet)}else{if(dY>zoneSize[1]&&dX<zoneSize[0]&&dX>-zoneSize[0]){isMoving=true
document.querySelector('#card').style.transition=`all ${animTimeOut}ms`
document.querySelector('#card').style.transform=getMatrix(angle,dX,dY+zoneSize[1]*1.5)}else{isMoving=true
document.querySelector('#card').style.transition=`all ${animTimeOut}ms`
document.querySelector('#card').style.transform=getMatrix(angle,dX+Math.sign(dX)*zoneSize[0]*2.2,dY+offsetY)}
if(gameRunning.get()){setTimeout(()=>{newCard()
isMoving=false},animTimeOut*1.5)}else{setTimeout(()=>{changePage('startmenu')},animTimeOut*2)}}}
let lastCoord=[0,0]
let turnTime=5
let turn=true
function handleDragMove(e){if(!isMoving){if(turn){turn=false
setTimeout(()=>{turn=true},turnTime)
lastCoord=[e.touches[0].clientX,e.touches[0].clientY]
dX=e.touches[0].clientX-oriX
dY=e.touches[0].clientY-oriY
if(dX>=0){angle=((((coerce(dX,0,200)-0)/(200-0))*(20-0)+0)*Math.PI)/180
document.querySelector('#play-name').style.opacity=((coerce(dX,0,100)-0)/(100-0))*(0.0-1.0)+1.0}else{angle=(-(((coerce(-dX,0,200)-0)/(200-0))*(20-0)+0)*Math.PI)/180
document.querySelector('#play-name').style.opacity=((coerce(-dX,0,100)-0)/(100-0))*(0.0-1.0)+1.0}
document.querySelector('#card').style.transform=getMatrix(angle,dX+offsetX,dY+offsetY)}}}
function throwCard(dir,bottom=0){if(!isMoving){let zoneSize=[document.body.clientWidth*0.3,document.body.clientHeight*0.33]
isMoving=true
document.querySelector('#card').style.transition=`all ${animTimeOut * 2}ms`
document.querySelector('#play-name').style.transition=`all ${animTimeOut * 2}ms`
document.querySelector('#play-name').style.opacity=0.0
document.querySelector('#card').style.transform=getMatrix(0.4*Math.sign(dir),Math.sign(dir)*zoneSize[0]*3.5,offsetY+bottom*zoneSize[1]*2.3)
if(gameRunning.get()){setTimeout(()=>{newCard()
isMoving=false},animTimeOut*2*1.2)}else{setTimeout(()=>{changePage('startmenu')},animTimeOut*2*2)}}}
function addInteraction(el){el.addEventListener('touchstart',handleDragStart,false)
el.addEventListener('touchend',handleDragEnd,false)
el.addEventListener('touchmove',handleDragMove,false)
window.onkeyup=(ev)=>{switch(ev.code){case'ArrowRight':throwCard(1)
break
case'ArrowLeft':throwCard(-1)
break
case'ArrowDown':throwCard(0,1)
break
default:break}}}
function getMatrix(angle,tx,ty){return`matrix(${Math.cos(angle)}, ${Math.sin(angle)}, ${-Math.sin(angle)}, ${Math.cos(
		angle
	)}, ${tx}, ${ty})`}
String.prototype.hash=function(){var hash=0
for(var i=0;i<this.length;i++){var code=this.charCodeAt(i)
hash=(hash<<5)-hash+code
hash=hash&hash}
return hash}
Array.prototype.removeElement=function(obj){const index=this.findIndex((i)=>i.name===obj.name)
if(index>-1){this.splice(index,1)}}
String.prototype.capitalizeFirst=function(){return this[0].toLocaleUpperCase()+this.substring(1)}
function detectInpKeys(el){el.onkeyup=(e)=>{if(e.key==='Enter'){document.querySelector('#pregame-addPlayerBtn').click()}}}
function reloadFresh(){sessionStorage.clear()
navigator.serviceWorker.getRegistration().then(function(reg){if(reg){reg.unregister().then(function(){location.reload()})}else{location.reload()}})}
function shareRoutine(){try{navigator.share({url:'https://drinkingapp-4376b.web.app/',title:'Trink! Trink!'}).then((d)=>console.log(d))}catch(e){console.log('not on a smartphone, copying to clipbaord instead of sharing')
try{navigator.clipboard.writeText('https://drinkingapp-4376b.web.app/').then((d)=>{alert('In die Zwischenablage kopiert')})}catch(e){console.log(e)}}}
const gameRunning={get:()=>{return sess.get('gameRunning')},turnOn:()=>{console.log('game is now running')
sess.set('gameRunning',true)},turnOff:()=>{console.log('game is now stopped')
sess.set('gameRunning',false)},}
const availCards={deck:undefined,get:()=>{availCards.deck=availCards.deck||sess.get('availCards')||[]
return availCards.deck},update:(par)=>{if(!gameRunning.get()){availCards.deck=par
sess.set('availCards',availCards.deck)}else{availCards.deck=sess.get('availCards')}},remove:(el)=>{availCards.deck.removeElement(el)
sess.set('availCards',availCards.deck)},rng:()=>{availCards.deck=availCards.deck||sess.get('playerList')||[]
return availCards.deck[Math.floor(Math.random()*availCards.deck.length)]},}
const playerList={players:undefined,get:()=>{playerList.players=playerList.players||sess.get('playerList')||[]
return playerList.players},add:(el)=>{playerList.players.push(el)
sess.set('playerList',playerList.players)
updatePlayerList()},remove:(el)=>{playerList.players.removeElement(el)
sess.set('playerList',playerList.players)
updatePlayerList()},rng:()=>{playerList.players=playerList.players||sess.get('playerList')||[]
return playerList.players[Math.floor(Math.random()*playerList.players.length)].name},}
const cardCounter={limit:25,cardCnt:0,get:()=>{cardCounter.cardCnt=cardCounter.cardCnt
console.log(cardCounter.cardCnt)
return cardCounter.cardCnt>cardCounter.limit?-1:cardCounter.cardCnt},incr:()=>{cardCounter.cardCnt+=1
sess.set('cardCnt',cardCounter.cardCnt)},}