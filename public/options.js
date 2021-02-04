const options = {
    gameModeTime: true,    // other mode is by count
    toggleGameMode: () => {
        this.gameModeTime != this.gameModeTime
        sess.set('gameModeTime', this.gameModeTime)
    },
    getGameMode: () => {
        this.gameModeTime = this.gameModeTime || sess.get('gameModeTime') || true
        return this.gameModeTime
    },
    updateGameModeView: () => {
        if (options.getGameMode()) {
            document.querySelector('#options-playWrapper .options-chkbx[data="time"]').toggleAttribute('active')
        } else {
            document.querySelector('#options-playWrapper .options-chkbx[data="count"]').toggleAttribute('active')
        }
    },
    toggleOption: (view, option) => {
        view.toggleAttribute('active')
        switch (option) {
            case 'time':
                document.querySelector('#options-playWrapper .options-chkbx[data="count"]').toggleAttribute('active')
                break

            case 'count':
                document.querySelector('#options-playWrapper .options-chkbx[data="time"]').toggleAttribute('active')
                break

            default:
                break
        }
    }
}