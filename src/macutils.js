import _debug from 'debug'
const debug = _debug('hodext:macutils')

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
