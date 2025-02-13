// cache management
cacheName = 'cache-beta-v0.7' // change to update cache
document.querySelector('#version').innerHTML = cacheName // display cache in corner and press it for full reload

// composition elements
const startMenu = './compos/startmenu.compo'
const preGame = './compos/pregame.compo'
const playPage = './compos/play.compo'
const optPage = './compos/options.compo'
let cardCompo = ''
fetch('./compos/card.compo')
	.then((res) => res.text())
	.then((data) => {
		cardCompo = data
	})

// session variables and relating
const sess = new Session()
//      moved to objects in helper.js

// other variable stuff
let currPage

// init
init(window.location.search.match(/(?<=(\?|&)page=)\w+/g)) // regex for url get page=

function init(site) {
	if (site === null) {
		loadCompo(startMenu)
		currPage = startMenu
		return
	}
	switch (site[0]) {
		case 'startmenu': // serve startmenu
			gameRunning.turnOff()
			loadCompo(startMenu)
			currPage = startMenu
			break
		case 'pregame': // serve pregame
			loadCompo(preGame).then((_) => {
				if (isMobile()) {
					document.querySelector('#pregame-addPlayerBtn').classList.add('pregame-hidden')
				}
				updatePlayerList()
			})
			currPage = preGame
			break
		case 'play': // serve playpage if at least 2 players present
			cardCounter.get() // just to initialize internal obj variables
			let playerCount = playerList.get().length
			// let playerCount = 999 // dbg
			if (playerCount > 1) {
				availCards.update(cards) // updates deck with all cards, only does something if game is not running
				loadCompo(playPage).then((_) => {
					setTimeout(() => {
						gameRunning.turnOn()
						newCard()
					}, 20)
				})
				currPage = playPage
			} else {
				changePage('pregame')
			}
			break
		case 'options':
			loadCompo(optPage).then(_ => options.updateViews())
			break
		default:
			changePage('startmenu')
			currPage = startMenu
			break
	}
}
// init end

function newCard() {
	// idk why I split all this up but here it is now
	cardCounter.incr()
	addCard(chooseCard())
}

let currCard = {}
function chooseCard() {
	// may change to just not repeat last X cards
	currCard = availCards.rng() // rng card
	availCards.remove(currCard)
	return currCard
}

function addCard(card) {
	if (currPage === playPage) {
		while (document.querySelector('#card') === null) { } // not nice, but still good way for this?!
		document.querySelector('#card').outerHTML = makeCard(card) // replace element
		// reset card, variables in helpers.js
		document.querySelector('#card').style.transition = 'all 0ms'
		document.querySelector('#card').style.transform = `matrix(0.01, 0, 0, 0.01, 0, ${offsetY})`
		document.querySelector('#card').style.opacity = '0.01'
		document.querySelector('#card').style.transition = `all ${animTimeIn}ms`
		// animate card, variables in helpers.js
		setTimeout(() => {
			document.querySelector('#card').style.transform = `matrix(1, 0, 0, 1, 0, ${offsetY})`
			document.querySelector('#card').style.opacity = '1.0'
			setInterval(() => {
				addInteraction(document.querySelector('#card')) // adding drag ability once cardIn animation is complete
			}, animTimeIn)
		}, 20)
	}
}

function makeCard(use) {
	let card = cardCompo
	const difficulty = options.getDifficulty() // for calc color later on
	const mul = difficulty === 0 ? .5 : difficulty === 1 ? 1 : 2.24
	try {
		if (cardCounter.get() === -1) {
			throw 'Game ending'
		}
		let choosenPlayer = 'Alle'
		if (!use.all) {
			// if card's specific to person, choose a rnd person
			choosenPlayer = playerList.rng()
		}
		document.querySelector('#play-name').innerHTML = choosenPlayer
		try {
			// replace any name placeholders in card with names other than choosenPlayer
			let cardPlayer1 = playerList.rng()
			while (cardPlayer1 === choosenPlayer) {
				cardPlayer1 = playerList.rng()
			}
			use.text = use.text.replace('[NAME1]', cardPlayer1)
		} catch (_) { }
		card = card // inserting text from card obj into card html
			.replace('*TITLE*', use.title)
			.replace('*TEXT*', use.text)
			.replace('*SET*', use.set)
			.replace('*COLOR*', `hsl(${120 - 60 * difficulty}, 90%, 64%)`) // calc color from diffitculty
		if (use.sips >= 0) { // inifity char when <0 aka. chug it!
			console.log(`sips: ${use.sips} * ${mul} = ${use.sips * mul}`)
			card = card
				.replace('*SIPS*', Math.ceil(use.sips * mul))
		} else {
			card = card
				.replace('*SIPS*', '&#x221e;')
		}
	} catch (error) {
		// error thrown when use is undefined, aka chooseCard returns undefined
		// console.error(error)
		card = card // inserting text for 'end of game' card
			.replace('*TITLE*', 'Das wars')
			.replace('*TEXT*', 'Danke fürs Spielen!<br>Wische einfach diese Karte weg.')
			.replace('*SET*', 'Ehre')
			.replace('*SIPS*', '&#x221e;')
			.replace('*COLOR*', 'url(#rainbow)')
		document.querySelector('#play-name').innerHTML = 'Alle'
		gameRunning.turnOff()
	}
	document.querySelector('#play-name').style.opacity = 1.0
	return card
}

function addPlayer() {
	// add player
	let player = {
		name: document.querySelector('#pregame-playernameInp').value.trim().capitalizeFirst(),
	}
	if (player.name.length > 1) {
		playerList.add(player)
		document.querySelector('#pregame-playernameInp').value = ''
		inpFocusOut()
	}
}

function removePlayer(el) {
	// remove player from local variable and update session var
	playerList.remove({ name: el.innerHTML })
}

function inpFocusIn() {
	// do when player input field is focused
	if (isMobile()) {
		document.querySelector('#pregame-playerlist').classList.add('pregame-hidden')
		document.querySelector('#pregame-playBtn').classList.add('pregame-hidden')
		document.querySelector('#pregame-addPlayerBtn').classList.remove('pregame-hidden')
	}
}

function inpFocusOut() {
	// do when player input field focus is lost
	if (isMobile() && document.querySelector('#pregame-playernameInp').value.trim().length <= 1) {
		document.querySelector('#pregame-playerlist').classList.remove('pregame-hidden')
		document.querySelector('#pregame-playBtn').classList.remove('pregame-hidden')
		document.querySelector('#pregame-addPlayerBtn').classList.add('pregame-hidden')

		updatePlayerList()
	}
}

function loadCompo(filePath) {
	// load a .compo file and put it contents in #root
	if (gameRunning.get() && filePath != playPage) {
		// go back to play page if trying to back out when game us running
		window.history.go(1)
		return
	}
	return fetch(filePath)
		.then((res) => res.text())
		.then((data) => {
			document.querySelector('#root').innerHTML = data
		})
}

function changePage(pageName) {
	// pretty self explanatory, commented out useful when there's more than just ?page
	// window.location.search = window.location.search.replace(currPage.split('/')[-1].split('.')[0], pageName)
	window.location.search = `?page=${pageName}`
}

function updatePlayerList() {
	// update visual player list in pregame
	if (playerList.get()) {
		document.querySelector('#pregame-playerlist').innerHTML = ''
		playerList.get().forEach((el) => {
			document.querySelector(
				'#pregame-playerlist'
			).innerHTML += `<span onclick="removePlayer(this)">${el.name}</span>`
		})
	}
}
