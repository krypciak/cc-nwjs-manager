import { PluginClass } from 'ultimate-crosscode-typedefs/modloader/mod';
import type { Mod1 } from 'ccmodmanager/src/types';
declare global {
    namespace sc {
        var nwjsManager: CCNwjsManager;
    }
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
}
