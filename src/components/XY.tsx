import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { StyleSheet, css } from 'aphrodite'
const clamp = require('clamp')

interface State {
  x?: number
  y?: number
  dragging?: boolean
}

interface Props {
}

const handleSize = 10
const borderWidth = 1

export default class XY extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      x: 0,
      y: 0,
      dragging: false,
    }
  }

  handleMouseDown = (e) => {
    e.preventDefault()

    this.setState({ dragging: true })

    window.addEventListener('mouseup', this.handleMouseUp)
    window.addEventListener('mousemove', this.handleMouseMove)
  }

  handleMouseUp = () => {
    this.setState({ dragging: false })

    window.removeEventListener('mouseup', this.handleMouseUp)
    window.removeEventListener('mousemove', this.handleMouseMove)
  }

  handleMouseMove = (e) => {
    e.preventDefault()

    if (!this.state.dragging) {
      return
    }

    const rect = this.getRect()
    const x = clamp(e.pageX - rect.left, 0, rect.width - handleSize - borderWidth)
    const y = clamp(e.pageY - rect.top, 0, rect.height - handleSize - borderWidth)

    this.setState({ x, y })
  }

  getRect() {
    return ReactDOM.findDOMNode(this).getBoundingClientRect()
  }

  render(): JSX.Element {
    return (
      <div
        className={css(styles.box)}
        onMouseDown={this.handleMouseDown}
      >
        <div
          className={css(styles.handle)}
          style={{
            left: (this.state.x) + 'px',
            top: (this.state.y) + 'px'
          }}>
          </div>
      </div>
    )
  }
}

const styles = StyleSheet.create({
  box: {
    width: '100px',
    height: '100px',
    border: borderWidth + 'px solid #ccc',
    position: 'relative',
  },

  handle: {
    width: handleSize,
    height: handleSize,
    border: '2px solid #666',
    borderRadius: '10px',
    position: 'absolute',
  }
})
