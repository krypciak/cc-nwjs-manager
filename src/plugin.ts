import type { PluginClass } from 'ultimate-crosscode-typedefs/modloader/mod'
import type { Mod1 } from 'ccmodmanager/types/types'
import { registerOpts } from './options'

async function doesFileExist(path: string): Promise<boolean> {
    return new Promise(resolve => {
        fs.promises
            .stat(path)
            .then(() => resolve(true))
            .catch(_err => resolve(false))
    })
}

const fs: typeof import('fs') = (0, eval)("require('fs')")

declare global {
    namespace sc {
        var nwjsManager: CCNwjsManager
    }
}

export default class CCNwjsManager implements PluginClass {
    static dir: string
    static mod: Mod1
    static baseDataPath: string

    constructor(mod: Mod1) {
        CCNwjsManager.dir = mod.baseDirectory
        CCNwjsManager.mod = mod
        CCNwjsManager.mod.isCCL3 = mod.findAllAssets ? true : false
        CCNwjsManager.mod.isCCModPacked = mod.baseDirectory.endsWith('.ccmod/')

        CCNwjsManager.baseDataPath = `assets/mod-data/cc-nwjs-manager`

        fs.promises.mkdir(CCNwjsManager.baseDataPath, { recursive: true })

        window.sc ??= {} as any
        sc.nwjsManager = this
    }

    prestart(): void | Promise<void> {
        registerOpts(this)
    }

    poststart(): void | Promise<void> {}

    private getUrl(
        version: string,
        sdk: boolean
    ): { url: string; archiveName: string; platform: string; extension: 'zip' | 'tar.gz' } {
        let arch: string
        if (process.arch == 'x64') {
            arch = 'x64'
        } else if (process.arch == 'x32' || process.arch == 'ia32') {
            arch = 'ia32'
        } else {
            throw new Error(`cc-nwjs-manager: Unsupported architecture: ${process.arch}`)
        }

        let platform: string
        if (process.platform == 'linux') {
            platform = 'linux'
        } else if (process.platform == 'win32') {
            platform = 'win'
        } else if (process.platform == 'darwin') {
            throw new Error(`cc-nwjs-manager: Unsupported platform: ${process.platform}`)
            // platform = 'osx'
        } else {
            throw new Error(`cc-nwjs-manager: Unsupported platform: ${process.platform}`)
        }

        const sdkStr = sdk ? 'sdk-' : ''
        const extension = platform == 'linux' ? 'tar.gz' : 'zip'

        const archiveName = `nwjs-${sdkStr}v${version}-${platform}-${arch}.${extension}`

        return {
            archiveName,
            platform,
            url: `https://dl.nwjs.io/v${version}/${archiveName}`,
            extension,
        }
    }

    async install(version: string, sdk: boolean): Promise<void> {
        const { url, archiveName, extension, platform } = this.getUrl(version, sdk)

        const archivePath = `${CCNwjsManager.baseDataPath}/${archiveName}`

        if (!(await doesFileExist(archivePath))) {
            console.log(`Downloading NW.js: ${url}`)
            const data = await (await fetch(url)).arrayBuffer()
            console.log(`Saving the NW.js archive to ${archivePath}`)
            await fs.promises.writeFile(archivePath, Buffer.from(data)).then(() => {
                console.log(`NW.js archive saved to ${archivePath}`)
            })
        }

        const crosscodePath = process.execPath

        if (extension == 'zip') {
            if (platform == 'win') {
                await this.spawnWindowsScript(`Expand-Archive -Force ${archivePath} .`)
                const directoryName = archiveName.substring(0, archiveName.length - '.zip'.length)
                this.spawnWindowsScript(
                    `cp -r -Force ${directoryName}\\* .; rm -r ${directoryName}; cp nw.exe CrossCode.exe; start ${crosscodePath}`
                )
            } else throw new Error('what')
        } else if (extension == 'tar.gz') {
            if (platform == 'linux') {
                await this.spawnLinuxScript(`tar xf "${archivePath}" --directory=.`)
                const directoryName = archiveName.substring(0, archiveName.length - '.tar.gz'.length)
                this.spawnLinuxScript(
                    `sleep 3 && cp -rf ./${directoryName}/* . && rm -rf ./${directoryName} && cp ./nw ./CrossCode && ${crosscodePath}`
                )
            } else throw new Error('what')
        }
        setTimeout(() => {
            nw.App.quit()
        }, 300)
    }

    private async spawnLinuxScript(cmd: string) {
        const cp: typeof import('child_process') = require('child_process')

        return new Promise<void>(resolve => {
            const child = cp.spawn('sh', ['-c', `${cmd}`])
            child.unref()
            child.on('exit', resolve)
        })
    }

    private async spawnWindowsScript(cmd: string) {
        const cp: typeof import('child_process') = require('child_process')

        return new Promise<void>(resolve => {
            const child = cp.exec(`powershell -command "${cmd.replace('/', '//').replace('\\', '\\\\')}"`)
            child.unref()
            child.on('exit', resolve)
        })
    }
}
