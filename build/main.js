cacheName='build.21.077.2241'
document.querySelector('#version').innerHTML=cacheName
const startMenu='./compos/startmenu.compo'
const preGame='./compos/pregame.compo'
const playPage='./compos/play.compo'
const optPage='./compos/options.compo'
let cardCompo=''
fetch('./compos/card.compo').then((res)=>res.text()).then((data)=>{cardCompo=data})
const sess=new Session()
let currPage
init(window.location.search.match(/(?<=(\?|&)page=)\w+/g))
function init(site){if(site===null){loadCompo(startMenu)
currPage=startMenu
return}
switch(site[0]){case'startmenu':gameRunning.turnOff()
loadCompo(startMenu)
currPage=startMenu
break
case'pregame':loadCompo(preGame).then((_)=>{if(isMobile()){document.querySelector('#pregame-addPlayerBtn').classList.add('pregame-hidden')}
updatePlayerList()})
currPage=preGame
break
case'play':cardCounter.get()
let playerCount=playerList.get().length
if(playerCount>1){availCards.update(cards)
loadCompo(playPage).then((_)=>{setTimeout(()=>{gameRunning.turnOn()
newCard()},20)})
currPage=playPage}else{changePage('pregame')}
break
case'options':loadCompo(optPage).then(_=>options.updateViews())
break
default:changePage('startmenu')
currPage=startMenu
break}}
function newCard(){cardCounter.incr()
addCard(chooseCard())}
let currCard={}
function chooseCard(){currCard=availCards.rng()
availCards.remove(currCard)
return currCard}
function addCard(card){if(currPage===playPage){while(document.querySelector('#card')===null){}
document.querySelector('#card').outerHTML=makeCard(card)
document.querySelector('#card').style.transition='all 0ms'
document.querySelector('#card').style.transform=`matrix(0.01, 0, 0, 0.01, 0, ${offsetY})`
document.querySelector('#card').style.opacity='0.01'
document.querySelector('#card').style.transition=`all ${animTimeIn}ms`
setTimeout(()=>{document.querySelector('#card').style.transform=`matrix(1, 0, 0, 1, 0, ${offsetY})`
document.querySelector('#card').style.opacity='1.0'
setInterval(()=>{addInteraction(document.querySelector('#card'))},animTimeIn)},20)}}
function makeCard(use){let card=cardCompo
const difficulty=options.getDifficulty()
const mul=difficulty===0?.5:difficulty===1?1:2.24
try{if(cardCounter.get()===-1){throw'Game ending'}
let choosenPlayer='Alle'
if(!use.all){choosenPlayer=playerList.rng()}
document.querySelector('#play-name').innerHTML=choosenPlayer
try{let cardPlayer1=playerList.rng()
while(cardPlayer1===choosenPlayer){cardPlayer1=playerList.rng()}
use.text=use.text.replace('[NAME1]',cardPlayer1)}catch(_){}
card=card.replace('*TITLE*',use.title).replace('*TEXT*',use.text).replace('*SET*',use.set).replace('*COLOR*',`hsl(${120 - 60 * difficulty}, 90%, 64%)`)
if(use.sips>=0){console.log(`sips: ${use.sips} * ${mul} = ${use.sips * mul}`)
card=card.replace('*SIPS*',Math.ceil(use.sips*mul))}else{card=card.replace('*SIPS*','&#x221e;')}}catch(error){card=card.replace('*TITLE*','Das wars').replace('*TEXT*','Danke fürs Spielen!<br>Wische einfach diese Karte weg.').replace('*SET*','Ehre').replace('*SIPS*','&#x221e;').replace('*COLOR*','url(#rainbow)')
document.querySelector('#play-name').innerHTML='Alle'
gameRunning.turnOff()}
document.querySelector('#play-name').style.opacity=1.0
return card}
function addPlayer(){let player={name:document.querySelector('#pregame-playernameInp').value.trim().capitalizeFirst(),}
if(player.name.length>1){playerList.add(player)
document.querySelector('#pregame-playernameInp').value=''
inpFocusOut()}}
function removePlayer(el){playerList.remove({name:el.innerHTML})}
function inpFocusIn(){if(isMobile()){document.querySelector('#pregame-playerlist').classList.add('pregame-hidden')
document.querySelector('#pregame-playBtn').classList.add('pregame-hidden')
document.querySelector('#pregame-addPlayerBtn').classList.remove('pregame-hidden')}}
function inpFocusOut(){if(isMobile()&&document.querySelector('#pregame-playernameInp').value.trim().length<=1){document.querySelector('#pregame-playerlist').classList.remove('pregame-hidden')
document.querySelector('#pregame-playBtn').classList.remove('pregame-hidden')
document.querySelector('#pregame-addPlayerBtn').classList.add('pregame-hidden')
updatePlayerList()}}
function loadCompo(filePath){if(gameRunning.get()&&filePath!=playPage){window.history.go(1)
return}
return fetch(filePath).then((res)=>res.text()).then((data)=>{document.querySelector('#root').innerHTML=data})}
function changePage(pageName){window.location.search=`?page=${pageName}`}
function updatePlayerList(){if(playerList.get()){document.querySelector('#pregame-playerlist').innerHTML=''
playerList.get().forEach((el)=>{document.querySelector('#pregame-playerlist').innerHTML+=`<span onclick="removePlayer(this)">${el.name}</span>`})}}