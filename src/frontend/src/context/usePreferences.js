import { useContext } from 'react'
import { PreferencesContext } from './preferencesContext.js'

export function usePreferences() {
  return useContext(PreferencesContext)
}