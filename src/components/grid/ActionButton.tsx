import classnames from 'classnames'
import React from 'react'
import type { ButtonClickHandler } from '../../App'

const ActionButton: React.FC<{
  text: string
  changeText?: string
  onClick: ButtonClickHandler
  activeDuration: number
}> = ({ text, changeText, onClick, activeDuration }) => {
  const clickHandler: ButtonClickHandler = (event) => {
    const target = event.target as HTMLButtonElement
    target.disabled = true
    onClick(event)
    buttonActive(target)
    target.disabled = false
  }

  const classes = classnames(
    'mt-2 w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
  )

  const setStyles = function (element: HTMLElement, styles: Object) {
    Object.assign(element.style, styles)
  }

  const buttonActive = function (element: HTMLButtonElement) {
    const {
      innerText,
      style: { color, backgroundColor },
    } = element

    setTimeout(() => {
      setStyles(element, {
        color: color,
        backgroundColor: backgroundColor,
      })
      element.innerText = innerText
    }, activeDuration)

    setStyles(element, {
      color: '#282c34',
      backgroundColor: 'white',
    })
    if (changeText) {
      element.innerText = changeText
    }
  }

  return (
    <button className={classes} onClick={clickHandler}>
      {text}
    </button>
  )
}

export default ActionButton
