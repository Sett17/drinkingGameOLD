# drinkingGame
***There is currently no plan to support internalization! This Project is in German!***

This is the source code for [this drinking game](http://drinkingapp-4376b.web.app/). It can either be played in the website, or be installed as a PWA on supported devices. TWA Version may come later.
For historial Commits and and older code look in [this rep](https://github.com/Sett17/drinkingGameOLD).

## Contribute
You are very welcome to contribute! Please make a pull request with the updated [cards.js](dev/assets/cards.js).

## Run
You can either run the live.py (appropiate python librabries needed) or start a webserver in the `/dev` folder.
Known-To-Work Example:
```bash
cd /path/to/project/dev/
python3 -m http.server
```

## Build
Tested on Linux (WSL) and Windows

To build and deploy run:
```bash
pip3 install -r requirements.txt
python3 build.py
```
**IMPORTANT** Don't use `py`/`py3`, you must use `python`/`python3`

# Deutsch
Das ist der Quellcode für [dieses Trinkspiel](http://drinkingapp-4376b.web.app/). Es kann entweder auf der Internetseite gespielt werden, oder als PWA installiert werden auf unterstützten Geräten.
Für historische Commits und alten Code, schaue in [dieser rep](https://github.com/Sett17/drinkingGameOLD).

## Mitwirken
Du bist gerne zum mitwirken eingeladen! Mache dafür ein Pull Request mit der ergänzten [cards.js](dev/assets/cards.js) oder schlag eine Idee in [diesem form](https://docs.google.com/forms/d/e/1FAIpQLSejdu8sNK8tI5Y3IP0LySg17WXdkxn9s_UeRKLBvFt3kKV_Vg/viewform) vor.

## Run
Du kannst entweder die live.py starten (benötigt weitere bibliotheken) oder einen webserver im `/dev` ordner starten.
Known-To-Work Beispiel:
```bash
cd /path/to/project/dev/
python3 -m http.server
```


## Build
Getestet auf Linux (WSL) und Windows

Zum bauen und deployen:
```bash
pip3 install -r requirements.txt
python3 build.py
```
**IMPORTANT** Benutze nicht `py`/`py3`, du musst `python`/`python3` benutzen.
