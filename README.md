<!-- markdownlint-disable MD013 MD024 MD001 MD045 -->

# Automatic NW.js versions downloader and installer for CrossCode

![image](https://github.com/krypciak/cc-nwjs-manager/assets/115574014/b076dcb4-6b9d-4634-86b6-538490ef4ac7)

### Api

```javascript
nwjsManager.install('0.35.5', /* sdk */ true)
nwjsManager.install('0.72.0', /* not sdk */ false)
nwjsManager.ensureVersion('0.72.0') /* if current NW.js version < 0.72.0 then install 0.72.0 */
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
