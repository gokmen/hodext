export const PREFIX = 'hodext'
export const NEWLINE = '\n'
export const ITEM_HEIGHT = 34
export const MAX_CHAR_COUNT = 68
export const SCROLL_THRESHOLD = 4
export const MAX_ITEM_COUNT = 500

export const STORAGE_FILE = 'clipboard.json'

export const ACTION_LOAD = 'LoadItems'

export const EVENT_LOADED = 'Loaded'
export const EVENT_WRITE_ITEM = 'WriteItem'
export const EVENT_DELETE_ITEM = 'DeleteItem'
export const EVENT_CLIPBOARD_CHANGED = 'ClipboardChanged'

export const EVENT_PASTE = 'Paste'
export const EVENT_HIDE = 'Hide'
export const EVENT_USE_DARK = 'UseDark'

export const INITIAL_DATA = [
  "Welcome to Hodext, copy some text and I'll hold it for you!",
  'Start typing to filter items in your clipboard',
  'You can navigate in clipboard with [Ctrl+J] and [Ctrl+K]',
  'Mouse navigation is also supported if you like',
  'Hit [Enter] to paste selected item to the previous active window',
  '[Ctrl+Enter] will only update the clipboard buffer',
  'If you want to delete an item [Ctrl+Backspace] is your friend',
  'You can close this window with [Esc] or by clicking any other window',
  'For more info please visit: https://github.com/gokmen/hodext',
]

import { app } from 'electron'

export const DEFAULT_MENU = [
  {
    label: 'Hodext',
    submenu: [
      {
        label: 'About Hodext',
        role: 'about',
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function() {
          app.quit()
        },
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo',
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut',
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall',
      },
    ],
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close',
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+Command+I',
        click: (item, fw) => {
          if (fw && process.env.DEBUG) fw.toggleDevTools()
        },
      },
    ],
  },
]
