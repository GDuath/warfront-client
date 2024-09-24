import {gameTicker} from "../../game/GameTicker";
import {clientPlayer, playerManager} from "../../game/player/PlayerManager";
import {formatPercent, formatTime, formatTroops} from "../../util/StringFormatter";
import {registerSettingListener, updateSetting} from "../../util/UserSettingManager";
import {registerClickListener, registerDragListener} from "../UIEventResolver";
import {showUIElement} from "../UIManager";

const troopSlider: HTMLElement = (window.document.getElementById("troopSlider") as HTMLElement);
const troopSliderFill: HTMLElement = (window.document.getElementById("troopSliderFill") as HTMLElement);
const troopSliderTroopsText: HTMLElement = (window.document.getElementById("troopSliderTroopsText") as HTMLElement);
const troopSliderPercentText: HTMLElement = (window.document.getElementById("troopSliderPercentText") as HTMLElement);
const troopSliderMarker: HTMLElement = (window.document.getElementById("troopSliderMarker") as HTMLElement);

let logPercent: number;

gameTicker.registry.register(() => {
    let troops = clientPlayer.getTroops();
    troopSliderTroopsText.innerHTML = formatTroops(Math.floor(troops * logPercent))
});

registerClickListener("troopSlider", (x, y) => {
    let percPos = getPercentPositioninElement(troopSlider, x, y);
    troopSliderFill.style.width = (percPos.x * 100) + "%"; 
    troopSliderMarker.style.left = (percPos.x * 100) + "%";
    troopSliderMarker.style.transform = "translate(" + ((percPos.x) * -100) + "%, -50%)";

    logPercent = linearTransformation(percPos.x);
    troopSliderPercentText.innerHTML = "(" + formatPercent(logPercent, 1) +")";
    troopSliderPercentText.innerHTML = "(" + formatPercent(logPercent, 1) +")";

    updateSetting("attack-power", logPercent);
});

registerDragListener("troopSlider",
    (x, y) => {},
    (x, y) => {
        let percPos = getPercentPositioninElement(troopSlider, x, y);
        troopSliderFill.style.width = (percPos.x * 100) + "%";
        troopSliderMarker.style.left = (percPos.x * 100) + "%";
        troopSliderMarker.style.transform = "translate(" + ((percPos.x) * -100) + "%, -50%)";

        logPercent = linearTransformation(percPos.x);
        troopSliderPercentText.innerHTML = "(" + formatPercent(logPercent, 1) + ")";

        updateSetting("attack-power", logPercent);
    },
    (x, y) => { });

function getRelativePositioninElement (elem: HTMLElement, x: number, y: number): {x: number, y: number} {
    let rect = elem.getBoundingClientRect();
    return {x: x - rect.left, y: y - rect.top};
}

function getPercentPositioninElement (elem: HTMLElement, x: number, y: number): {x: number, y: number} {
    let rect = elem.getBoundingClientRect();
    return {x: (x - rect.left) / rect.width, y: (y - rect.top) / rect.height};
}

function linearTransformation (sliderValue: number) {
    const b: number = 0.0223;
    const a: number = 12;
    const e: number = Math.E;  // Euler's number
    const result: number = a * (Math.pow(e, b * (sliderValue * 100)) - 1);
    return result / 100;
}