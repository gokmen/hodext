## Development

Just clone the repository and do following;

```
 $ npm install
 $ npm start
```

If you need debugging you can enable with `DEBUG` env variable;

```
 $ DEBUG=hodext* npm start
```

When debug is enabled Hodext main window will have a title bar and keep stay
visible on focus change to make debugging easier. This will also open the dev
tools automatically.

## Building

Currently only macOS supported which you can build for it via;

```
 $ npm run build:mac
```

will create a new application under `dist` folder for x64.

## Warning for Mac OS

Currently Nodobjc has an ABI issue with the current release (`2.1.0`) which
requires rebuild after installation;

```
 $ npm rebuild --runtime=electron --target=1.8.2 --disturl=https://atom.io/download/atom-shell --abi=50
```

this will rebuild it for Electron `1.8.2` version. If Electron version is
different you will need to change the version string in `target`

ref: https://github.com/TooTallNate/NodObjC/issues/85
