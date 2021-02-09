const options = {
    updateViews: () => {
        options.updateDifficultyView()
    },

    // // gameMode
    // gameModeTime: true,    // other mode is by count
    // toggleGameMode: () => {
    //     this.gameModeTime = !this.gameModeTime
    //     sess.set('gameModeTime', this.gameModeTime)
    //     options.updateGameModeView()
    // },
    // getGameMode: () => {
    //     if (this.gameModeTime === undefined) {
    //         let z = sess.get('gameModeTime')
    //         if (z === null) {
    //             this.gameModeTime = true
    //         } else {
    //             this.gameModeTime = z
    //         }
    //     } else {
    //         this.gameModeTime = this.gameModeTime
    //     }
    //     return this.gameModeTime
    // },
    // updateGameModeView: () => {
    //     if (options.getGameMode()) {
    //         document.querySelector('#options-playWrapper .options-chkbx[data="time"]').setAttribute('active', '')
    //         document.querySelector('#options-playWrapper .options-chkbx[data="count"]').removeAttribute('active')
    //     } else {
    //         document.querySelector('#options-playWrapper .options-chkbx[data="count"]').setAttribute('active', '')
    //         document.querySelector('#options-playWrapper .options-chkbx[data="time"]').removeAttribute('active')
    //     }
    // },
    // // ------------------------

    // difficulty
    difficultyLvl: undefined,   // number from 0,1,2
    difficultyChanged: (arg) => {
        arg = arg < 0 ? 0 : arg > 2 ? 0 : arg // set arg to 0 if out if range
        this.difficultyLvl = parseInt(arg)
        sess.set('difficultyLvl', this.difficultyLvl)
        options.updateDifficultyView()
    },
    getDifficulty: () => {
        this.difficultyLvl = this.difficultyLvl || parseInt(sess.get('difficultyLvl')) || 0
        console.log(this.difficultyLvl)
        return this.difficultyLvl
    },
    updateDifficultyView: () => {
        let z = options.getDifficulty()
        switch (z) {
            case 0:
                document.querySelector('#options-difficultyWrapper .options-chkbx[data-id="0"]').setAttribute('active', '')
                document.querySelector('#options-difficultyWrapper .options-chkbx[data-id="1"]').removeAttribute('active')
                document.querySelector('#options-difficultyWrapper .options-chkbx[data-id="2"]').removeAttribute('active')
                break
            case 1:
                document.querySelector('#options-difficultyWrapper .options-chkbx[data-id="0"]').removeAttribute('active')
                document.querySelector('#options-difficultyWrapper .options-chkbx[data-id="1"]').setAttribute('active', '')
                document.querySelector('#options-difficultyWrapper .options-chkbx[data-id="2"]').removeAttribute('active')
                break
            case 2:
                document.querySelector('#options-difficultyWrapper .options-chkbx[data-id="0"]').removeAttribute('active')
                document.querySelector('#options-difficultyWrapper .options-chkbx[data-id="1"]').removeAttribute('active')
                document.querySelector('#options-difficultyWrapper .options-chkbx[data-id="2"]').setAttribute('active', '')
                break

            default:
                break
        }
    }
    // ---------------------------
}