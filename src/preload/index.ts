import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import Login from '../main/util/login'
import RequestHeader from '../main/util/request-header'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('Login', Login)
    contextBridge.exposeInMainWorld('RequestHeader', RequestHeader)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // window.Login = Login
  // window.RequestHeader = RequestHeader
}
