import React from 'react'
import './Cell.css'
import classNames from 'classnames'
import { CellProps } from '../../App'

const Cell: React.FC<CellProps> = ({ prompt, stamped, toggleStamped }) => {
  const classes = classNames('cell text-lg ml-2.5 dark:text-white', {
    stamped: stamped,
  })

  const htmlSoftHyphen = '&shy;'
  const unicodeSoftHyphen = '\u00ad'
  const normalise = (string: string): string =>
    string.replace(new RegExp(htmlSoftHyphen, 'g'), unicodeSoftHyphen)

  return (
    <td role="gridcell" className={classes} onClick={toggleStamped}>
      {normalise(prompt)}
    </td>
  )
}

export default Cell
