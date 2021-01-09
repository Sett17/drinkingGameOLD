// cache management
cacheName = "cache-dev-v2.2.8"  // change to update cache
document.querySelector('#version').innerHTML = cacheName    // display cache in corner and press it for full reload

// constants
const startMenu = "./compos/startmenu.compo"
const preGame = "./compos/pregame.compo"
const playPage = "./compos/play.compo"
const sess = new Session()

// card stuff
let cardCompo = ""
fetch("./compos/card.compo")
    .then(res => res.text())
    .then(data => { cardCompo = data })

// session variables and relating
// let highestId = -1
// let playerlist = []
// if (sess.get('playerList')) {
//     playerlist = sess.get('playerList')
// }
// let usedCards = []
// if (sess.get('usedCards')) {
//     usedCards = sess.get('usedCards')
// }
// let cards = []
// if (sess.get('cards')) {
//     cards = sess.get('cards')
// }

// other variable stuff
let currPage

// init
//processing stuff after ? in url
let search = window.location.search.slice(1).split('&')
for (let i = 0; i < search.length; i++) {
    search[i] = search[i].split('=')
}
// responding to ? parameters
search.forEach(el => {
    switch (el[0]) {
        case "page":
            switch (el[1]) {
                case "startmenu":   // serve startmenu
                    loadCompo(startMenu)
                    currPage = startMenu
                    break
                case "pregame":     // serve pregame
                    loadCompo(preGame)
                        .then(_ => {
                            if (isMobile()) {
                                document.querySelector('#pregame-addPlayerBtn').classList.add('pregame-hidden')
                            }
                            updatePlayerList()
                        })
                    currPage = preGame
                    break
                case "play":        // serve playpage if at least 2 players present
                    let playerCount = playerList.get().length
                    // let playerCount = 999 // dbg
                    if (playerCount > 1) {
                        availCards.update(cards) // updates deck with all cards, only does something if game is not running
                        loadCompo(playPage)
                            .then(_ => {
                                gameRunning.turnOn()
                                newCard()
                            })
                        currPage = playPage
                    } else {
                        changePage('pregame')
                    }
                    break
                // in other 'error'/'fringe' cases, serve startmenu
                case "":
                    loadCompo(startMenu)
                    currPage = startMenu
                    break
                case undefined:
                    loadCompo(startMenu)
                    currPage = startMenu
                    break
                default:
                    break
            }
            break
        default:    // serve startmenu when page paramter not present
            loadCompo(startMenu)
            currPage = startMenu
    }
})
// init end

function newCard() {        // idk why I split all this up but here it is now
    addCard(chooseCard())
}

let currCard = {}
function chooseCard() {     // may change to just not repeat last X cards
    let zCards = availCards.get()
    currCard = zCards[Math.floor(Math.random() * zCards.length)]    // rng card
    availCards.remove(currCard)
    return currCard
}

function addCard(card) {
    if (currPage === playPage) {
        while (document.querySelector('#card') === null) { } // note nice, but still good way for this?!
        document.querySelector('#card').outerHTML = makeCard(card)  // replace element
        // reset card, variables in helpers.js
        document.querySelector('#card').style.transition = "all 0ms"
        document.querySelector('#card').style.transform = `matrix(0.01, 0, 0, 0.01, 0, ${offsetY})`
        document.querySelector('#card').style.opacity = "0.01"
        document.querySelector('#card').style.transition = `all ${animTimeIn}ms`
        // animate card, variables in helpers.js
        setTimeout(() => {
            document.querySelector('#card').style.transform = `matrix(1, 0, 0, 1, 0, ${offsetY})`
            document.querySelector('#card').style.opacity = "1.0"
            setInterval(() => {
                addDrags(document.querySelector('#card')) // adding drag ability once cardIn animation is complete
            }, animTimeIn)
        }, 20)
    }
}

function makeCard(use) {
    let card = cardCompo
    try {
        card = card     // inserting text from card obj into card html
            .replace("*TITLE*", use.title)
            .replace("*TEXT*", use.text)
            .replace("*SET*", use.set)
        if (use.sips >= 0) {
            card = card.replace("*SIPS*", use.sips)
        } else {
            card = card.replace("*SIPS*", "&#x221e;")

        }
        if (use.all) {  // if card's specific to person, choose a rnd person
            document.querySelector('#play-name').innerHTML = "Alle"
        } else {
            document.querySelector('#play-name').innerHTML = playerList.rng()
        }
    } catch (error) {   // error thrown when use is undefined, aka chooseCard returns undefined
        card = card     // inserting text for 'end of game' card
            .replace("*TITLE*", "Das wars")
            .replace("*TEXT*", "Danke fürs Spielen!<br>Wische einfach diese Karte weg.")
            .replace("*SET*", "Ehre")
            .replace("*SIPS*", "&#x221e;")
        document.querySelector('#play-name').innerHTML = "Alle"
        gameRunning.turnOff()
    }
    document.querySelector('#play-name').style.opacity = 1.0
    return card
}

function addPlayer() {  // add player
    let player = {
        name: document.querySelector('#pregame-playernameInp').value.trim(),
    }
    console.log(player)
    if (player.name.length > 1) {
        playerList.add(player)
        document.querySelector('#pregame-playernameInp').value = ""
        inpFocusOut()
    }
}

function removePlayer(el) {     // remove player from local variable and update session var
    playerList.remove(el)
}

function inpFocusIn() {     // do when player input field is focused
    if (isMobile()) {
        document.querySelector('#pregame-playerlist').classList.add('pregame-hidden')
        document.querySelector('#pregame-playBtn').classList.add('pregame-hidden')
        document.querySelector('#pregame-addPlayerBtn').classList.remove('pregame-hidden')
    }
}

function inpFocusOut() {    // do when player input field focus is lost
    if (isMobile() && document.querySelector('#pregame-playernameInp').value.trim().length <= 1) {
        document.querySelector('#pregame-playerlist').classList.remove('pregame-hidden')
        document.querySelector('#pregame-playBtn').classList.remove('pregame-hidden')
        document.querySelector('#pregame-addPlayerBtn').classList.add('pregame-hidden')

        updatePlayerList()
    }
}

function loadCompo(filePath) {      // load a .compo file and put it contents in #root
    if (gameRunning.get() && filePath != playPage) {    // go back to play page if trying to back out when game us running
        window.history.go(1)
        return
    }
    return fetch(filePath)
        .then(res => res.text())
        .then(data => { document.querySelector('#root').innerHTML = data })
}

function changePage(pageName) {     // pretty self explanatory, commented out 
    // window.location.search = window.location.search.replace(currPage.split('/')[-1].split('.')[0], pageName)
    window.location.search = `?page=${pageName}`
}

function updatePlayerList() {       // update visual player list in pregame
    if (playerList.get()) {
        document.querySelector('#pregame-playerlist').innerHTML = ""
        playerList.get().forEach(el => {
            document.querySelector('#pregame-playerlist').innerHTML += `<span dataid="${el.id}" onclick="removePlayer(this)">${el.name}</span>`
        })
    }
}