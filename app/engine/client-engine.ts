import { Logger } from "./logging-engine";
import { LandingPageManager } from "./page-managers/landing-page";

export abstract class LanternEngine {
    static logger: Logger = new Logger("LanternEngine");

    //page managers
    static landing: typeof LandingPageManager = LandingPageManager;
    
}