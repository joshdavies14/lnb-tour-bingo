import type { CellData } from '../App'
import chunk from 'lodash/chunk'
import { UAParser } from 'ua-parser-js'

const webShareApiDeviceTypes: string[] = ['mobile', 'smarttv', 'wearable']
const parser = new UAParser()
const browser = parser.getBrowser()
const device = parser.getDevice()

const shareGridText = function (cellDataList: CellData[]): string {
  const emojiList = cellDataList.map(({ stamped }) => (stamped ? '🟦' : '⬜'))

  const stampedCount = cellDataList.filter((cell) => {
    return cell.stamped
  }).length

  const emojiRows = chunk(emojiList, 5).map((row) => row.join(''))
  return (
    'LnB Comp Bingo\n\n' +
    emojiRows.join('\n') +
    '\n\nTotal: ' +
    stampedCount +
    '/25'
  )
}

export const shareGrid = (
  cellDataList: CellData[],
  handleShareToClipboard: () => void
) => {
  const textToShare = shareGridText(cellDataList)

  const shareData = { text: textToShare }

  let shareSuccess = false

  try {
    if (attemptShare(shareData)) {
      navigator.share(shareData)
      shareSuccess = true
    }
  } catch (error) {
    shareSuccess = false
  }

  if (!shareSuccess) {
    navigator.clipboard.writeText(textToShare).then(() => {
      handleShareToClipboard()
    })
  }
}

const attemptShare = (shareData: object) => {
  return (
    // Deliberately exclude Firefox Mobile, because its Web Share API isn't working correctly
    browser.name?.toUpperCase().indexOf('FIREFOX') === -1 &&
    webShareApiDeviceTypes.indexOf(device.type ?? '') !== -1 &&
    navigator.canShare &&
    navigator.canShare(shareData) &&
    navigator.share
  )
}

export default shareGrid
