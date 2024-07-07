import { gameTicker, GameTickListener } from "../../game/GameTicker";
import { formatTime } from "../../util/StringFormatter";
import { ModuleAdapter } from "../ModuleLoader";

class ClockListener implements GameTickListener {
	tick() {
		lblGameTime.innerHTML = formatTime(gameTicker.getElapsedIngameTime());
	}
}

const lblGameTime: HTMLElement = (window.document.getElementById("lblGameTime") as HTMLElement);
const clockListener: ClockListener = new ClockListener();

export default {
	onOpen: () => {
		gameTicker.registry.register(clockListener);
	}
} as ModuleAdapter;

(window as any).commandExitGame = function () {
	window.location.reload();
};



