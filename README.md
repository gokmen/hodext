<p align="center">
  <img src="https://raw.githubusercontent.com/gokmen/hodext/master/assets/images/hodext-banner@2x.png" width="20%" />
</p>

# Hodext, Hold the text!

Named after great person [Hodor](http://gameofthrones.wikia.com/wiki/Hodor),
**Hodext** is my clipboard manager based on Electron. It has a simple design
similar to Alfred on macOS. And comes up when you press `Alt+Space`:

<p align="center">
  <img src="https://raw.githubusercontent.com/gokmen/hodext/master/assets/images/hodext-app-dark.png" />
</p>

You can navigate on items by using arrow keys or `Ctrl+J` for down `Ctrl+K`
for up. `Enter` will paste the selected content to the previous active window.
You can also choose to update current clipboard content without pasting it by
using `Ctrl+Enter` shortcut instead. And for sure you can filter your clipboard
by just typing some characters as you wish, which will filter the list based on
the content and the application name which content is copied from.
If you change focus to another window or hit `Esc` or `Ctrl+C` this will hide
Hodext. While window is visible you can use `Command+Q` to quit.

It has theme support which reflects macOS theme selection, if you use Dark Menu
Bar you will see it like in the previous screenshot, otherwise it will match
with menu bar's white color scheme;

<p align="center">
  <img src="https://raw.githubusercontent.com/gokmen/hodext/master/assets/images/hodext-app-white.png" />
</p>

By default it ignores sensitive information like things you've copied from
1Password or any concealed data will not end up in Hodext's list. But if you
would like to remove an entry you can use `Ctrl+Backspace` on the active item.

## Install

You can use prebuilt application from [releases](https://github.com/gokmen/hodext/releases)
page or you can simply clone this repository and run following;

```
 $ npm install
 $ npm start
```

If you want to build and use it as an application you can do;

```
 $ npm run build:mac
```

Which will create the app under `dist` folder.

## Details

I also agree that Electron is not the best choice for making an application
that runs all the time in the background, but it was ok for me for a while.

I've made it for fun and exploring new things while covering a requirement for
myself. It's build on Electron and uses React with BabelJS, uses NodObjc for
dealing with macOS API and Fuse.js for searching.

It can be written in many different ways on many different platforms but as
said it was an experiment for me and I'm sharing it with you now. You can think
this as a resource for developing a desktop application with Electron and React.

## Todo

I'm planning to work on Linux support and the settings panel first since
currently there is no way to change shortcuts etc. If you want to help you can
take a look to [TODO.md](/TODO.md) and
[DEVELOPMENT.md](/DEVELOPMENT.md)

## License

MIT (c) 2018 Gokmen Goksel
