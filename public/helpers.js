function isMobile() {
	// check if device is a mobile device
	let hasTouchScreen = false
	if ('maxTouchPoints' in navigator) {
		// check for touch, probably breaks down with other touch stuff except phones
		hasTouchScreen = navigator.maxTouchPoints > 1
	} else if ('msMaxTouchPoints' in navigator) {
		// same as above
		hasTouchScreen = navigator.msMaxTouchPoints > 1
	} else {
		var mQ = window.matchMedia && matchMedia('(pointer:coarse)')
		if (mQ && mQ.media === '(pointer:coarse)') {
			// I don't really know
			hasTouchScreen = !!mQ.matches
		} else if ('orientation' in window) {
			// deprecated, but good last measure
			hasTouchScreen = true
		}
	}
	return hasTouchScreen
}

class Session extends Map {
	// 'borrowed' code for saving objects in session vars
	set(id, value) {
		// translates them to json
		if (typeof value === 'object') value = JSON.stringify(value)
		sessionStorage.setItem(id, value)
	}

	get(id) {
		// translates them from json
		const value = sessionStorage.getItem(id)
		try {
			return JSON.parse(value)
		} catch (e) {
			return value
		}
	}
}

function coerce(num, min, max) {
	// coerces number between min and max
	if (num < min) {
		return min
	} else if (num > max) {
		return max
	} else {
		return num
	}
}

function mapRange(inp, inpStart, inpEnd, outpStart, outpEnd) {
	// return output_start + ((output_end - output_start) / (input_end - input_start)) * (input - input_start)
	return outpStart + ((outpEnd - outpStart) / (inpEnd - inpStart)) * (inp - inpStart)
}

// card dragging stuff
let oriX = 0,
	oriY = 0,
	dX = 0,
	dY = 40,
	offsetX = 0,
	offsetY = 40,
	angle = 0 // y offs of 40 to make the composition better
let isMoving = false
function handleDragStart(e) {
	// dragging started, reset everything
	document.querySelector('#card').style.transition = `all ${turnTime}ms`
	dX = 0
	dY = 0
	if (!isMoving) {
		oriX = e.touches[0].clientX
		oriY = e.touches[0].clientY
	}
}

// animation constants
const animTimeRet = 100
const animTimeBounce = 80
const animTimeOut = 150
const animTimeDef = 150
let animTimeIn = 100
if (isMobile) {
	animTimeIn = 250 // doesn't really show with default value, 'cause mobile browser rendering is shit
}

function handleDragEnd(e) {
	// do when finger is released
	// calculate zone for card being thrown out, 30% for sides and 33% for bottom
	// not really a 'zone' anymore, can't be bothered to think of another name
	let zoneSize = [document.body.clientWidth * 0.3, document.body.clientHeight * 0.33]
	if (dX < zoneSize[0] && dX > -zoneSize[0] && dY < zoneSize[1]) {
		// do when card is NOT thrown out
		document.querySelector('#play-name').style.opacity = 1.0
		isMoving = true
		document.querySelector('#card').style.transition = `all ${animTimeRet}ms`
		// reset angle
		document.querySelector('#card').style.transform = getMatrix(
			0,
			-Math.sign(dX) * 15,
			-Math.sign(dY) * 15 + offsetY
		)
		setTimeout(() => {
			// reset/animate everything else
			document.querySelector('#card').style.transition = `all ${animTimeBounce}ms`
			document.querySelector('#card').style.transform = getMatrix(0, 0, offsetY)
			setTimeout(() => {
				isMoving = false
				document.querySelector('#card').style.transition = `all ${turnTime}ms`
			}, animTimeBounce)
		}, animTimeRet)
	} else {
		// card being thrown out
		if (dY > zoneSize[1] && dX < zoneSize[0] && dX > -zoneSize[0]) {
			// throw out bottom
			isMoving = true
			document.querySelector('#card').style.transition = `all ${animTimeOut}ms`
			document.querySelector('#card').style.transform = getMatrix(angle, dX, dY + zoneSize[1] * 1.5)
		} else {
			// throw out side
			isMoving = true
			document.querySelector('#card').style.transition = `all ${animTimeOut}ms`
			document.querySelector('#card').style.transform = getMatrix(
				angle,
				dX + Math.sign(dX) * zoneSize[0] * 2.2,
				dY + offsetY
			)
		}
		if (gameRunning.get()) {
			// next card
			setTimeout(() => {
				newCard()
				isMoving = false
			}, animTimeOut * 1.5)
		} else {
			// last card thrown out, back to startmenu
			setTimeout(() => {
				changePage('startmenu')
			}, animTimeOut * 2) // longer pause, 'cause it kind of feels better
		}
	}
}

let lastCoord = [0, 0]

let turnTime = 5
let turn = true
function handleDragMove(e) {
	// do when dragging
	if (!isMoving) {
		// don't do anything while card is animated
		if (turn) {
			// only do if turnTime milliseconds have past since last (close to every other)
			turn = false
			setTimeout(() => {
				turn = true
			}, turnTime) // enable turn after turnTime !IMPORTANT
			lastCoord = [e.touches[0].clientX, e.touches[0].clientY]
			dX = e.touches[0].clientX - oriX
			dY = e.touches[0].clientY - oriY
			if (dX >= 0) {
				// concerning left and right 'cause coerce doesn't do what it should with negatives or I just fucked up
				angle = ((((coerce(dX, 0, 200) - 0) / (200 - 0)) * (20 - 0) + 0) * Math.PI) / 180 // mapping number range to another; 0:200->0:20
				document.querySelector('#play-name').style.opacity =
					((coerce(dX, 0, 100) - 0) / (100 - 0)) * (0.0 - 1.0) + 1.0 // 0:100->0.0:1.0
			} else {
				angle = (-(((coerce(-dX, 0, 200) - 0) / (200 - 0)) * (20 - 0) + 0) * Math.PI) / 180 // dX and angle are negated; 0:200->0:20
				document.querySelector('#play-name').style.opacity =
					((coerce(-dX, 0, 100) - 0) / (100 - 0)) * (0.0 - 1.0) + 1.0 // dX is negated; 0:100->0.0:1.0
			}
			document.querySelector('#card').style.transform = getMatrix(angle, dX + offsetX, dY + offsetY)
		}
	}
}
// card dragging stuff end

function throwCard(dir, bottom = 0) {
	if (!isMoving) {
		let zoneSize = [document.body.clientWidth * 0.3, document.body.clientHeight * 0.33]
		isMoving = true
		document.querySelector('#card').style.transition = `all ${animTimeOut * 2}ms`
		document.querySelector('#play-name').style.transition = `all ${animTimeOut * 2}ms`
		document.querySelector('#play-name').style.opacity = 0.0
		document.querySelector('#card').style.transform = getMatrix(
			0.4 * Math.sign(dir),
			Math.sign(dir) * zoneSize[0] * 3.5,
			offsetY + bottom * zoneSize[1] * 2.3
		)

		if (gameRunning.get()) {
			// next card
			setTimeout(() => {
				newCard()
				isMoving = false
			}, animTimeOut * 2 * 1.2)
		} else {
			// last card thrown out, back to startmenu
			setTimeout(() => {
				changePage('startmenu')
			}, animTimeOut * 2 * 2) // longer pause, 'cause it kind of feels better
		}
	}
}

function addInteraction(el) {
	// add dragging functionality to element
	el.addEventListener('touchstart', handleDragStart, false)
	el.addEventListener('touchend', handleDragEnd, false)
	el.addEventListener('touchmove', handleDragMove, false)

	window.onkeyup = (ev) => {
		switch (ev.code) {
			case 'ArrowRight':
				throwCard(1)
				break
			case 'ArrowLeft':
				throwCard(-1)
				break
			case 'ArrowDown':
				throwCard(0, 1)
				break

			default:
				break
		}
	}
}

function getMatrix(angle, tx, ty) {
	//makes 2d transformation matrix from angle and translation
	return `matrix(${Math.cos(angle)}, ${Math.sin(angle)}, ${-Math.sin(angle)}, ${Math.cos(
		angle
	)}, ${tx}, ${ty})`
}

function loadCards() {
	// loading the cards, duh; used in init
	return fetch('./assets/cards.json').then((d) => d.json())
} // returns promise

String.prototype.hash = function () {
	// 'borrowed', not used rn
	var hash = 0
	for (var i = 0; i < this.length; i++) {
		var code = this.charCodeAt(i)
		hash = (hash << 5) - hash + code
		hash = hash & hash // Convert to 32bit integer
	}
	return hash
}

Array.prototype.removeElement = function (obj) {
	// remove object out of array, because that is not buil-in to js, smh
	const index = this.findIndex((i) => i.name === obj.name)
	if (index > -1) {
		this.splice(index, 1) // splice modifies original array
	}
}

String.prototype.capitalizeFirst = function () {
	return this[0].toLocaleUpperCase() + this.substring(1)
}

function detectInpKeys(el) {
	el.onkeyup = (e) => {
		if (e.key === 'Enter') {
			document.querySelector('#pregame-addPlayerBtn').click()
		}
	}
}

function reloadFresh() {
	// unregister service-worker, and then reload the page
	sessionStorage.clear()
	navigator.serviceWorker.getRegistration().then(function (reg) {
		if (reg) {
			reg.unregister().then(function () {
				location.reload()
			})
		} else {
			location.reload()
		}
	})
}

function shareRoutine() {
	// share function on startmenu
	try {
		// native share function on phone/browser (unfortunately asks browser to share...)
		navigator
			.share({
				url: 'https://drinkingapp-4376b.web.app/',
				title: 'Trink! Trink!',
			})
			.then((d) => console.log(d))
	} catch (e) {
		// if share function not there, put it into clipboard and tell user
		console.log('not on a smartphone, copying to clipbaord instead of sharing')
		try {
			navigator.clipboard.writeText('https://drinkingapp-4376b.web.app/').then((d) => {
				alert('In die Zwischenablage kopiert') // prolly should make a custom modal, well
			})
		} catch (e) {
			// don't know why that shouldn't work, but you do that with navigator when not doing feature detec
			console.log(e)
		}
	}
}

const gameRunning = {
	// obj for the game state
	get: () => {
		return sess.get('gameRunning')
	},
	turnOn: () => {
		console.log('game is now running')
		sess.set('gameRunning', true)
	},
	turnOff: () => {
		console.log('game is now stopped')
		sess.set('gameRunning', false)
	},
}

const availCards = {
	// obj to keep track of the deck
	deck: undefined, // array
	get: () => {
		availCards.deck = availCards.deck || sess.get('availCards') || [] // set deckfrom sessionStorage if not set before
		return availCards.deck
	},
	update: (par) => {
		if (!gameRunning.get()) {
			// only update deckif game is not running
			availCards.deck = par
			sess.set('availCards', availCards.deck)
		} else {
			availCards.deck = sess.get('availCards') // get current deck from sessionStorage
		}
	},
	remove: (el) => {
		// removes single card from deck
		availCards.deck.removeElement(el)
		sess.set('availCards', availCards.deck)
	},
	rng: () => {
		availCards.deck = availCards.deck || sess.get('playerList') || []
		return availCards.deck[Math.floor(Math.random() * availCards.deck.length)]
	},
}

const playerList = {
	players: undefined, // array
	get: () => {
		playerList.players = playerList.players || sess.get('playerList') || []
		return playerList.players
	},
	add: (el) => {
		playerList.players.push(el)
		sess.set('playerList', playerList.players)
		updatePlayerList()
	},
	remove: (el) => {
		playerList.players.removeElement(el)
		sess.set('playerList', playerList.players)
		updatePlayerList()
	},
	rng: () => {
		playerList.players = playerList.players || sess.get('playerList') || []
		return playerList.players[Math.floor(Math.random() * playerList.players.length)].name
	},
}


const cardCounter = {
	limit: 10,
	cardCnt: 0,
	get: () => {
		cardCounter.cardCnt = cardCounter.cardCnt
		console.log(cardCounter.cardCnt)
		return (cardCounter.cardCnt > cardCounter.limit) ? -1 : cardCounter.cardCnt
	},
	incr: () => {
		cardCounter.cardCnt += 1
		sess.set('cardCnt', cardCounter.cardCnt)
	}
}