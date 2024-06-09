import CCNwjsManager from './plugin';
export declare let Opts: ReturnType<typeof sc.modMenu.registerAndGetModOptions<ReturnType<typeof registerOpts>>>;
export declare function registerOpts(nwjsManager: CCNwjsManager): {
    readonly general: {
        readonly settings: {
            readonly title: "General";
            readonly tabIcon: "general";
        };
        readonly headers: {
            readonly general: {
                readonly sdk: {
                    readonly type: "CHECKBOX";
                    readonly init: false;
                    readonly name: "SDK";
                    readonly description: "Use the SDK version, which grants access to the developer console";
                };
                readonly version: {
                    readonly type: "OBJECT_SLIDER";
                    readonly data: Record<string, number>;
                    readonly init: 0;
                    readonly fill: true;
                    readonly showPercentage: true;
                    readonly customNumberDisplay: (index: number) => string;
                    readonly name: "Version";
                    readonly description: "Target NW.js version.";
                };
                readonly installNow: {
                    readonly type: "BUTTON";
                    readonly onPress: () => void;
                    readonly name: "Install now";
                    readonly description: "Press to install now";
                };
            };
        };
    };
};
