import type { PluginClass } from 'ultimate-crosscode-typedefs/modloader/mod';
import type { Mod1 } from 'ccmodmanager/types/types';
declare global {
    var nwjsManager: CCNwjsManager;
}
export default class CCNwjsManager implements PluginClass {
    static dir: string;
    static mod: Mod1;
    static baseDataPath: string;
    constructor(mod: Mod1);
    prestart(): void | Promise<void>;
    poststart(): void | Promise<void>;
    private getUrl;
    install(version: string, sdk: boolean): Promise<void>;
    private spawnLinuxScript;
    private spawnWindowsScript;
    /** Grabs the SDK argument from the current installation.
     * @param version {string} If this version < current NW.js version, install this NW.js version
     * @returns {boolean} True if no installation is needed */
    ensureVersion(version: string): boolean;
}
