Development
-----------

Just clone the repository and do following;

```
 $ npm install
 $ npm start
```

If you need debugging you can enable with DEBUG env variable;

```
 $ DEBUG=hodext* npm start
```

## Warning for Mac OS

Currently Nodobjc has an ABI issue with the current release (2.1.0) which requires rebuild after installation;

```
 $ npm rebuild --runtime=electron --target=1.4.15 --disturl=https://atom.io/download/atom-shell --abi=50
```

this will rebuild it for electron 1.4.15 version. ref: https://github.com/TooTallNate/NodObjC/issues/85


