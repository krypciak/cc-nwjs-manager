<!-- markdownlint-disable MD013 MD024 MD001 MD045 -->

# Automatic NW.js versions downloader and installer for CrossCode

## Screenshot

### Api

```javscript
sc.nwjsManager.install('0.35.5', /* sdk */ true)
sc.nwjsManager.install('0.72.0', /* not sdk */ false)
```

## Building

```bash
git clone https://github.com/krypciak/cc-nwjs-manager
cd cc-nwjs-manager
pnpm install
pnpm run start
# this should return no errors (hopefully)
npx tsc
```
