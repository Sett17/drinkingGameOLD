// prettier-ignore
const cards = [
    {
        "title": "Schusselig?",
        "text": "Hast du schonmal dein Handy verloren?",
        "sips": 3,
        "all": false,
        "set": "Wahrheit"
    },
    {
        "title": "Schande",
        "text": "Hast du schonmal harte Drogen  zu dir genommen?",
        "sips": 3,
        "all": false,
        "set": "Wahrheit"
    },
    {
        "title": "Was muss das muss",
        "text": "Hast du schonmal in einen Blumentopf gepinkelt?",
        "sips": 2,
        "all": true,
        "set": "Wahrheit"
    },
    {
        "title": "Auf EX",
        "text": "Die Person die zuerst ihr Glas leert, bestimmt eine Person die eine Getränk ihrer Wahl trinken muss",
        "sips": -1,
        "all": true,
        "set": "Pflicht"
    },
    {
        "title": "Papagei",
        "text": "[NAME1] muss alles wiederholen, was du sagst",
        "sips": 1,
        "all": false,
        "set": "Virus"
    },
    {
        "title": "Blatt vorm Mund",
        "text": "Worte für das weibliche Genital. [NAME1] startet! Wem als erstes nix mehr einfällt trinkt",
        "sips": 2,
        "all": true,
        "set": "Minigame"
    },
    {
        "title": "Längenvergleich",
        "text": "Trink für jede Person, die größer ist als  du",
        "sips": 1,
        "all": false,
        "set": "Pflicht"
    },
    {
        "title": "Wer zuerst kommt...",
        "text": "Wer als letztes angekommen ist, trinkt um seine Verspätung aufzuholen",
        "sips": 5,
        "all": false,
        "set": "Pflicht"
    },
    {
        "title": "Hoch die Hände",
        "text": "Hebt einen Arm. Wer ihn als erstes runternimmt trinkt, und wer ihn als letztes runternimmt verteilt",
        "sips": 5,
        "all": false,
        "set": "Minigame"
    },
    {
        "title": "Tauchstation",
        "text": "Halte deinen Atem für 30 Sekunden",
        "sips": 4,
        "all": false,
        "set": "Pflicht"
    },
    {
        "title": "Wer wirds sein",
        "text": "Zeigt auf den, der für Geld alles macht. Der 'Gewinner' trinkt",
        "sips": 4,
        "all": true,
        "set": "Wahrheit"
    },
    {
        "title": "Hunger?",
        "text": "Burger bei McDonalds. Wer denselben Burger wiederohlt oder wem nichts mehr einfällt, trinkt. [NAME1] beginnt",
        "sips": 3,
        "all": true,
        "set": "Minigame"
    },
    {
        "title": "Auf der Suche?",
        "text": "Trinke wenn du auf Tinder unterwegs bist",
        "sips": 2,
        "all": true,
        "set": "Wahrheit"
    },
    {
        "title": "Pfui!",
        "text": "Ihr Raucher, trinkt auf das Wohlsein eurer Lungen",
        "sips": 5,
        "all": true,
        "set": "Wahrheit"
    },
    {
        "title": "Abstimmung!",
        "text": "Vanille- oder Schokoladeneis? Die Außenseiter trinken",
        "sips": 1,
        "all": true,
        "set": "Minigame"
    },
    {
        "title": "Du bist dran!",
        "text": "Du darfst eine neue Regel entwerfen",
        "sips": 2,
        "all": false,
        "set": "Virus"
    },
    {
        "title": "Sorry!",
        "text": "Wir mögen dich alle sehr, aber du musst trotzdem trinken",
        "sips": 7,
        "all": false,
        "set": "Pflicht"
    },
    {
        "title": "Wer wirds sein",
        "text": "Zeigt auf den, der heute noch am ehesten kotzt. Der 'Gewinner' trinkt",
        "sips": 1,
        "all": true,
        "set": "Minigame"
    },
    {
        "title": "Wirklich?",
        "text": "Hast du schonmal einen Salat bei McDonald's bestellt?",
        "sips": 2,
        "all": true,
        "set": "Wahrheit"
    },
    {
        "title": "Auf Ex",
        "text": "Die Person die als letztes aufgestanden ist und sich einmal im Kreis gedreht hat, trinkt",
        "sips": -1,
        "all": true,
        "set": "Minigame"
    },
    {
        "title": "Wer wirds sein",
        "text": "Wählt die Person, die sich am leichtesten kidanppen ließe. Der 'Gewinner' trinkt",
        "sips": 3,
        "all": true,
        "set": "Minigame"
    },
    {
        "title": "So eine/r...",
        "text": "Trink, wenn du so eine/r bist, der den ganzen Film lang Fragen stellt...",
        "sips": 4,
        "all": false,
        "set": "Wahrheit"
    },
    {
        "title": "Fürs Vaterland",
        "text": "Sing den Anfang der Nationalhymne. Bei Fehlern trinken",
        "sips": 3,
        "all": false,
        "set": "Pflicht"
    },
    {
        "title": "Styler",
        "text": "Trink, wenn du eine Kappe oder Mütze trägst",
        "sips": 1,
        "all": true,
        "set": "Wahrheit"
    },
    {
        "title": "Abstimmung",
        "text": "Reich in Nordkorea oder arm in Deutschland sein? Die 'Außenseiter' trinken",
        "sips": 4,
        "all": true,
        "set": "Minigame"
    },
    {
        "title": "Längenvergleich",
        "text": "Trink für jede Person die kleiner ist als du",
        "sips": 1,
        "all": false,
        "set": "Pflicht"
    },
    {
        "title": "Die Großeltern",
        "text": "Alle, die älter sind als du, trinken",
        "sips": 5,
        "all": false,
        "set": "Minigame"
    },
    {
        "title": "Best of 3",
        "text": "Spiele Schere-Stein-Papier gegen [NAME1]",
        "sips": 3,
        "all": false,
        "set": "Minigame"
    },
    {
        "title": "Verständlich",
        "text": "Trink, wenn du dich schonmal krankgemeldest hast, weil du verkatert warst.",
        "sips": 4,
        "all": true,
        "set": "Wahrheit"
    },
    {
        "title": "Blatt vorm Mund",
        "text": "Worte für das männliche Genital. [NAME1] startet! Wem als erstes nix mehr einfällt trinkt",
        "sips": 5,
        "all": true,
        "set": "Minigame"
    },
    {
        "title": "Wer kennt sich aus",
        "text": "Getränke die mit 'H' anfangen, gegen einen Spieler deiner Wahl. Der Verlierer trinkt",
        "sips": 2,
        "all": false,
        "set": "Minigame"
    },
    {
        "title": "double or nothing",
        "text": "Alle ungeraden Schlucke werden verdoppel",
        "sips": 1,
        "all": true,
        "set": "Virus"
    },
    {
        "title": "Numer 17 mit süß-sauer",
        "text": "Gerichte die man bei jedem Asiaten bekommen kann. [NAME1] startet! Wem als erstes nix mehr enifällt trinkt!",
        "sips": 3,
        "all": true,
        "set": "Minigame"
    },
    {
        "title": "Gewinn-Ausgaben=PROFIT",
        "text": "Trinke wenn du etwas in Richtung Wirtschaft oder BWL studierst",
        "sips": 3,
        "all": true,
        "set": "Wahrheit"
    },
    {
        "title": "Wieviele Finger?",
        "text": "Wenn du Brillenträger bist, trinke",
        "sips": 3,
        "all": true,
        "set": "Pflicht"
    },
    {
        "title": "Wünsch dir was",
        "text": "Sag etwas was du noch nie gemacht hast, aber schon immer machen wolltest. Jeder der es schon gemacht hat trinkt! [NAME1] startet",
        "sips": 4,
        "all": true,
        "set": "Minigame"
    },
    {
        "title": "ABCDEFG",
        "text": "Sage das Alphabet rückwärts auf, wenn du einen Fehler machst fange von vorne an. Du hast 3 Leben!",
        "sips": -1,
        "all": false,
        "set": "Pflicht"
    },
    {
        "title": "Uuhhhhh",
        "text": "Trink so viele Schlücke wie es schöne Brüste es im gibt",
        "sips": -1,
        "all": false,
        "set": "Pflicht"
    },
]