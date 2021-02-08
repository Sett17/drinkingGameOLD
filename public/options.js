const options = {
    gameModeTime: true,    // other mode is by count
    toggleGameMode: () => {
        this.gameModeTime = !this.gameModeTime
        sess.set('gameModeTime', this.gameModeTime)
        options.updateGameModeView()
    },
    getGameMode: () => {
        if (this.gameModeTime === undefined) {
            let z = sess.get('gameModeTime')
            if (z === null) {
                this.gameModeTime = true
            } else {
                this.gameModeTime = z
            }
        } else {
            this.gameModeTime = this.gameModeTime
        }
        return this.gameModeTime
    },
    updateGameModeView: () => {
        if (options.getGameMode()) {
            document.querySelector('#options-playWrapper .options-chkbx[data="time"]').setAttribute('active', '')
            document.querySelector('#options-playWrapper .options-chkbx[data="count"]').removeAttribute('active')
        } else {
            document.querySelector('#options-playWrapper .options-chkbx[data="count"]').setAttribute('active', '')
            document.querySelector('#options-playWrapper .options-chkbx[data="time"]').removeAttribute('active')
        }
    },
}