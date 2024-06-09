import type { Options } from 'ccmodmanager/types/mod-options'
import CCNwjsManager from './plugin'

export let Opts: ReturnType<typeof sc.modMenu.registerAndGetModOptions<ReturnType<typeof registerOpts>>>

import versions from './versions.json'

const versionsEnum = versions.reduce((acc, v, i) => Object.assign(acc, { [v]: i }), {} as Record<string, number>)

export function registerOpts(nwjsManager: CCNwjsManager) {
    const opts = {
        general: {
            settings: {
                title: 'General',
                tabIcon: 'general',
            },
            headers: {
                general: {
                    sdk: {
                        type: 'CHECKBOX',
                        init: false,
                        name: 'SDK',
                        description: 'Use the SDK version, which grants access to the developer console',
                    },
                    version: {
                        type: 'OBJECT_SLIDER',
                        data: versionsEnum,
                        init: 0,

                        fill: true,
                        showPercentage: true,
                        customNumberDisplay(index: number): string {
                            return versions[index]
                        },
                        name: 'Version',
                        description: 'Target NW.js version.',
                    },
                    installNow: {
                        type: 'BUTTON',

                        onPress() {
                            const opts = sc.modMenu.options['cc-nwjs-manager']
                            const version = versions[opts.version]
                            nwjsManager.install(version, opts.sdk)
                        },
                        name: 'Install now',
                        description: 'Press to install now',
                    },
                },
            },
        },
    } as const satisfies Options

    Opts = sc.modMenu.registerAndGetModOptions(
        {
            modId: 'cc-nwjs-manager',
            title: 'NW.js manager',
            // helpMenu: Lang.help.options,
        },
        opts
    )
    Opts.version = versions.indexOf(process.versions.nw)
    Opts.sdk = process.versions['nw-flavor'] == 'sdk'

    return opts
}
