import { useState, useEffect } from 'react'
import type { MouseEvent } from 'react'
import useSession from './lib/useSession'
import Grid from './components/grid/Grid'
import { InfoModal } from './components/modals/InfoModal'
import { SettingsModal } from './components/modals/SettingsModal'
import {
  GAME_COPIED_MESSAGE,
  DISCOURAGE_INAPP_BROWSER_TEXT,
} from './constants/strings'
import {
  setStoredIsHighContrastMode,
  getStoredIsHighContrastMode,
} from './lib/localStorage'
import { DISCOURAGE_INAPP_BROWSERS } from './constants/settings'
import { PROMPTS } from './constants/prompts'

import './App.css'
import { AlertContainer } from './components/alerts/AlertContainer'
import { useAlert } from './context/AlertContext'
import { Navbar } from './components/navbar/Navbar'
import ActionButton from './components/grid/ActionButton'
import { isInAppBrowser } from './lib/browser'

type ClickHandler<T> = (event: MouseEvent<T>) => void
type CellClickHandler = ClickHandler<HTMLTableDataCellElement>
export type ButtonClickHandler = ClickHandler<HTMLButtonElement>
export type CellData = { prompt: string; stamped: boolean }
export type CellProps = CellData & { toggleStamped: CellClickHandler }

function App() {
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme')
      ? localStorage.getItem('theme') === 'dark'
      : prefersDarkMode
  )
  const [isHighContrastMode, setIsHighContrastMode] = useState(
    getStoredIsHighContrastMode()
  )

  useEffect(() => {
    DISCOURAGE_INAPP_BROWSERS &&
      isInAppBrowser() &&
      showErrorAlert(DISCOURAGE_INAPP_BROWSER_TEXT, {
        persist: false,
        durationMs: 7000,
      })
  }, [showErrorAlert])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (isHighContrastMode) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [isDarkMode, isHighContrastMode])

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  const handleHighContrastMode = (isHighContrast: boolean) => {
    setIsHighContrastMode(isHighContrast)
    setStoredIsHighContrastMode(isHighContrast)
  }

  const newCellDataList = function (): CellData[] {
    return PROMPTS().map((prompt) => {
      return { prompt: prompt, stamped: false }
    })
  }

  const [cellDataList, setCellDataList] =
    useSession<CellData[]>(newCellDataList)

  const setStamped = (index: number, stamped: boolean): void => {
    setCellDataList(
      cellDataList.map((cellData, cellDataIndex) => {
        if (index === cellDataIndex) {
          return { ...cellData, stamped: stamped }
        } else {
          return cellData
        }
      })
    )
  }

  const toggleStampedForIndex = function (
    index: number,
    stamped: boolean
  ): CellClickHandler {
    return () => {
      setStamped(index, !stamped)
    }
  }

  const cellPropsList: CellProps[] = cellDataList.map((cellData, index) => ({
    ...cellData,
    toggleStamped: toggleStampedForIndex(index, cellData.stamped),
  }))

  const setNewWords: ButtonClickHandler = () => {
    setCellDataList(newCellDataList())
  }

  const clearAllCells: ButtonClickHandler = () => {
    setCellDataList(
      cellDataList.map((cellData) => ({ ...cellData, stamped: false }))
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
        cellDataList={cellDataList}
        handleShareToClipboard={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
      />
      <div className="pt-2 px-1 pb-8 md:max-w-7xl w-full mx-auto sm:px-6 lg:px-8 flex flex-col grow">
        <div className="pb-6 grow">
          <div className="grid grid-cols-2 gap-4 pb-6">
            <ActionButton
              text="New card"
              onClick={setNewWords}
              activeDuration={100}
            />
            <ActionButton
              text="Clear"
              onClick={clearAllCells}
              activeDuration={100}
            />
          </div>
          <Grid cellPropsList={cellPropsList} />
        </div>
        <InfoModal
          isOpen={isInfoModalOpen}
          handleClose={() => setIsInfoModalOpen(false)}
        />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          handleClose={() => setIsSettingsModalOpen(false)}
          isDarkMode={isDarkMode}
          handleDarkMode={handleDarkMode}
          isHighContrastMode={isHighContrastMode}
          handleHighContrastMode={handleHighContrastMode}
        />
        <AlertContainer />
      </div>
    </div>
  )
}

export default App
