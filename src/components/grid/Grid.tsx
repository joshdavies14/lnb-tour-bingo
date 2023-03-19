import React from 'react'
import './Grid.css'
import Cell from './Cell'
import { CellProps } from '../../App'
import chunk from 'lodash/chunk'

const Grid: React.FC<{ cellPropsList: CellProps[] }> = ({ cellPropsList }) => {
  const chunked = chunk(cellPropsList, 5)

  return (
    <table className="Grid" role="grid">
      <tbody>
        {chunked.map((row, index) => (
          <Row cellPropsList={row} key={index} />
        ))}
      </tbody>
    </table>
  )
}

const Row: React.FC<{ cellPropsList: CellProps[] }> = ({ cellPropsList }) => {
  return (
    <tr className="Row">
      {cellPropsList.map(({ prompt, stamped, toggleStamped }) => (
        <Cell
          key={prompt}
          prompt={prompt}
          stamped={stamped}
          toggleStamped={toggleStamped}
        />
      ))}
    </tr>
  )
}

export default Grid
