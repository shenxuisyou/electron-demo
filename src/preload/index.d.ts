import { ElectronAPI } from '@electron-toolkit/preload'
import Login from '../main/util/login'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    RequestHeader: Record<string, any>
    Login: typeof Login
  }
}
