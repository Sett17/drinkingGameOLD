const options={updateViews:()=>{options.updateDifficultyView()},difficultyLvl:undefined,difficultyChanged:(arg)=>{arg=arg<0?0:arg>2?0:arg
options.difficultyLvl=parseInt(arg)
sess.set('difficultyLvl',options.difficultyLvl)
options.updateDifficultyView()},getDifficulty:()=>{options.difficultyLvl=options.difficultyLvl||parseInt(sess.get('difficultyLvl'))||0
return options.difficultyLvl},updateDifficultyView:()=>{let z=options.getDifficulty()
switch(z){case 0:document.querySelector('#options-difficultyWrapper .options-chkbx[data-id="0"]').setAttribute('active','')
document.querySelector('#options-difficultyWrapper .options-chkbx[data-id="1"]').removeAttribute('active')
document.querySelector('#options-difficultyWrapper .options-chkbx[data-id="2"]').removeAttribute('active')
break
case 1:document.querySelector('#options-difficultyWrapper .options-chkbx[data-id="0"]').removeAttribute('active')
document.querySelector('#options-difficultyWrapper .options-chkbx[data-id="1"]').setAttribute('active','')
document.querySelector('#options-difficultyWrapper .options-chkbx[data-id="2"]').removeAttribute('active')
break
case 2:document.querySelector('#options-difficultyWrapper .options-chkbx[data-id="0"]').removeAttribute('active')
document.querySelector('#options-difficultyWrapper .options-chkbx[data-id="1"]').removeAttribute('active')
document.querySelector('#options-difficultyWrapper .options-chkbx[data-id="2"]').setAttribute('active','')
break
default:break}}}