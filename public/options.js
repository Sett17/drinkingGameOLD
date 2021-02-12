const options = {
    // update all views/elements
    updateViews: () => {
        options.updateDifficultyView()
    },

    // difficulty
    difficultyLvl: undefined,   // number from 0,1,2
    // fn called by DOM
    difficultyChanged: (arg) => {
        arg = arg < 0 ? 0 : arg > 2 ? 0 : arg // set arg to 0 if out if range
        options.difficultyLvl = parseInt(arg)
        sess.set('difficultyLvl', options.difficultyLvl)
        options.updateDifficultyView()
    },
    getDifficulty: () => {
        options.difficultyLvl = options.difficultyLvl || parseInt(sess.get('difficultyLvl')) || 0   // last fallback is default value if game is started without changing any settings
        return options.difficultyLvl
    },
    updateDifficultyView: () => {
        let z = options.getDifficulty()
        switch (z) {
            // should prolly make this cleaner in some way, well it's good enough
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