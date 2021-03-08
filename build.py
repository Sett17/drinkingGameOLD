from jsmin import jsmin
import shutil
import os
from pathlib import Path
from datetime import datetime
import glob
import psutil


def doPrebuild():
    print('\nPrebuild:')
    if not os.path.exists('./build'):
        print(f'\x1b[4G\x1b[31m./build does not exist.\x1b[90m\n\x1b[4GCreating it now...\x1b[0m')
        os.mkdir('./build')
    else:
        print('\x1b[4G\x1b[90mClearing out ./build...\x1b[0m')
        os.popen('rm -rf ./build/*').read()
    os.popen('cp -rf ./dev/* ./build/').read()
    print('\x1b[4G\x1b[32mCopied all files to ./build\x1b[0m')


def doRefactor():
    print('\nRefactoring:')
    # minutesOfDay = str(int(datetime.now().strftime("%H")) * 60 + int(datetime.now().strftime("%M"))).zfill(4)
    print(f'\x1b[4G\x1b[90mBuild number:\x1b[0m {datetime.now().strftime("%y.%j.%H%M")}')
    Path('./build/main.js').write_text(Path('./build/main.js').read_text().replace('#BUILDNUMBER#', 'build.' + datetime.now().strftime("%y.%j.%H%M")))
    Path('./build/service-worker.js').write_text(Path('./build/service-worker.js').read_text().replace('#BUILDNUMBER#', 'build.' + datetime.now().strftime("%y.%j.%H%M")))
    print(f'\x1b[4G\x1b[32mBuild number set in appropiate files\x1b[0m')


def doMinifying():
    print('\nMinifying:')
    delimiter = '\\' if os.name == 'nt' else '/'  # use \ as delimiter in next print if we're on windows
    for x in compressFiles:
        minified = jsmin(Path(x).read_text(), quote_chars="'\"`")
        print('\x1b[90m\x1b[4GMinified ' +
              delimiter.join(x.split(delimiter)[:-1]) + delimiter + '\x1b[32m' + x.split(delimiter)[-1] + '\x1b[0m')
        Path(x).write_text(minified)


def doRelease():
    print('\nDeploying:')
    if not os.path.exists('firebase.json'):
        print('\x1b[31m\x1b[4GFirebase isn\'t configured!\x1b[0m')
        valid = {"yes": True, "y": True, "ye": True, "no": False, "n": False}
        executeFirebase = False
        stillAsking = True
        while stillAsking:
            print('\x1b[31m\x1b[4GDo you want to execute "firebase init" to resolve this issue? [y/n]\x1b[0m', end=' ')
            choice = input().lower()
            if choice in valid:
                executeFirebase = valid[choice]
                stillAsking = False
            # else:
            #     sys.stdout.write("Please respond with 'yes' or 'no' (or 'y' or 'n').\n")
        if executeFirebase:
            print('\x1b[0m\x1b[6GPlease select the following when prompted:')
            print('\x1b[8G\x1b[32m? \x1b[0mWhich Firebase CLI features?\x1b[38;5;166m Hosting')
            print('\x1b[8G\x1b[32m? \x1b[0mPlease select an option:\x1b[38;5;166m Use an existing Project')
            print('\x1b[8G\x1b[32m? \x1b[0mSelect a default Firebase project for this directory:\x1b[38;5;166m drinkingapp-4376b (trink)')
            print('\x1b[8G\x1b[32m? \x1b[0mWhat do you want to use as your public directory?\x1b[38;5;166m Build')
            print('\x1b[8G\x1b[32m? \x1b[0mConfigure as a single-page app (rewrite all urls to /index.html)?\x1b[38;5;166m y')
            print('\x1b[8G\x1b[32m? \x1b[0mFile build/index.html already exists. Overwrite?\x1b[38;5;166m n\x1b[2E')
            os.system('firebase init')
            print('\x1b[6G\x1b[32mFirebase successfully initialzed!\x1b[0m\x1b[1E')
        else:
            print('\x1b[31m\x1b[4GSkipping new commit, because deployment failed')
            raise RuntimeError('\nCan\'t deploy without Firebase beeing initialized!')
    print('\x1b[4GExecuting \x1b[38;5;147mfirebase deploy\x1b[0m... \x1b[90m(output supressed)')
    removeOutput = ''
    removeError = ''
    if psutil.Process(os.getppid()).name() == 'bash':
        removeOutput = ' > /dev/null'
        removeError = ' 2> /dev/null'
    elif psutil.Process(os.getppid()).name() == 'powershell.exe':
        removeOutput = ' > $null'
        removeError = ' 2> $null'
    elif psutil.Process(os.getppid()).name() == 'cmd.exe':
        removeOutput = ' > null'
        removeError = ' 2> null'
    deployExitCode = os.system('firebase deploy' + removeOutput)
    if deployExitCode == 0:
        print('\x1b[6G\x1b[32mSuccessfully executed \x1b[38;5;147mfirebase deploy\x1b[0m')
    else:
        print('\x1b[6G\x1b[31mError executing \x1b[38;5;147mfirebase deploy\x1b[0m')
        raise RuntimeError('Look above for Error from "firebase deploy"')

    print('\x1b[4GExecuting \x1b[38;5;147mseveral git commands\x1b[0m... \x1b[90m(output partially supressed)')
    gitExitCode = os.system('git add . --all ' + removeError + ' && git commit --allow-empty -m "Build and Deploy from build.py at ' +
                            datetime.now().strftime("%d.%m.%y %H:%M") + '" ' + removeOutput + '&& git push ' + removeOutput)
    if gitExitCode == 0:
        print('\x1b[6G\x1b[32mSuccessfully executed \x1b[38;5;147mseveral git commands\x1b[32m\x1b[0m')
    else:
        print('\x1b[6G\x1b[31mError executing \x1b[38;5;147mseveral git commands\x1b[32m\x1b[0m')
        print('\x1b[6G\x1b[31mReasons could be that there is not git rep or no remote is connected\x1b[0m')
        raise RuntimeError('Look above for Error from several git commands')


print('\x1b[90m----- kind of a Buildscript -----\x1b[0m')

doPrebuild()

allFiles = [
    os.path.join(root, name)
    for root, dirs, files in os.walk('./build')
    for name in files
]
compressFiles = [
    os.path.join(root, name)
    for root, dirs, files in os.walk('./build')
    for name in files
    if name.endswith(('.html', '.htm', '.compo', '.css', '.js'))
]
htmlFiles = [
    os.path.join(root, name)
    for root, dirs, files in os.walk('./build')
    for name in files
    if name.endswith(('.html', '.htm'))
]

doRefactor()

doMinifying()

doRelease()

print('\x1b[1E\x1b[32mBuild script was successfully executed. Well done!')
