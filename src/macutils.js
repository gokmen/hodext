const debug = require('debug')('hodext:macutils')

debug('Loading nodobjc...')

import NodObjc from 'nodobjc'
NodObjc.framework('AppKit')
NodObjc.import('CoreGraphics')

const NSSharedWorkspace = NodObjc.NSWorkspace('sharedWorkspace')

debug('Nodobjc loaded.')

export function getFrontApp() {
  debug('Getting frontApp...')

  let name = `${NSSharedWorkspace('frontmostApplication')('localizedName')}`

  debug('frontApp found as follow', name)

  return { name }
}

export function firePaste() {
  // Create Keyboard Event for v key (9)
  let vKeyDown = NodObjc.CGEventCreateKeyboardEvent(null, 9, true)
  let vKeyUp = NodObjc.CGEventCreateKeyboardEvent(null, 9, false)

  // Mask events with Command Flag
  NodObjc.CGEventSetFlags(vKeyDown, NodObjc.kCGEventFlagMaskCommand)
  NodObjc.CGEventSetFlags(vKeyUp, NodObjc.kCGEventFlagMaskCommand)

  // Post events
  NodObjc.CGEventPost(NodObjc.kCGHIDEventTap, vKeyDown)
  NodObjc.CGEventPost(NodObjc.kCGHIDEventTap, vKeyUp)
}
