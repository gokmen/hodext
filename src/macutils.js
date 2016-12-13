import _debug from 'debug'
const debug = _debug('hodext:macutils')

import { exec } from 'child_process'

debug('Loading nodobjc...')

import NodObjc from 'nodobjc'
NodObjc.framework('AppKit')
const NSSharedWorkspace = NodObjc.NSWorkspace('sharedWorkspace')

debug('Nodobjc loaded.')

export function getFrontApp () {

  debug('Getting frontApp...')

  let frontApp = NSSharedWorkspace('frontmostApplication')

  debug('frontApp found as follow', frontApp)

  return {
    "name": ""+frontApp('localizedName')
  }

}

export function firePaste () {
  exec(`osascript -e 'tell application "System Events"' -e 'keystroke "v" using command down' -e 'end tell'`)
}
