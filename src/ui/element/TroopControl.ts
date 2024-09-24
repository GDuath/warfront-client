import {gameTicker} from "../../game/GameTicker";
import {formatPercent, formatTime} from "../../util/StringFormatter";
import {registerSettingListener, updateSetting} from "../../util/UserSettingManager";
import {registerClickListener, registerDragListener} from "../UIEventResolver";
import {showUIElement} from "../UIManager";

const troopSlider: HTMLElement = (window.document.getElementById("troopSlider") as HTMLElement);
const troopSliderFill: HTMLElement = (window.document.getElementById("troopSliderFill") as HTMLElement);
const troopSliderText: HTMLElement = (window.document.getElementById("troopSliderText") as HTMLElement);

registerClickListener("troopSlider", (x, y) => {
    let percPos = getPercentPositioninElement(troopSlider, x, y);
    troopSliderFill.style.width = (percPos.x * 100) + "%"; 

    var logPercent = linearTransformation(percPos.x);
    troopSliderText.innerHTML = formatPercent(logPercent, 1);

    updateSetting("attack-power", logPercent);
});

registerDragListener("troopSlider",
    (x, y) => {},
    (x, y) => {
        let percPos = getPercentPositioninElement(troopSlider, x, y);
        troopSliderFill.style.width = (percPos.x * 100) + "%";

        var logPercent = linearTransformation(percPos.x);
        troopSliderText.innerHTML = formatPercent(logPercent, 1);

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