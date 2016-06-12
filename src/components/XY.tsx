import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { StyleSheet, css } from 'aphrodite'
const clamp = require('clamp')

interface State {
  x?: number
  y?: number
  dragging?: boolean
  width?: number
  height?: number
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
      width: 0,
      height: 0,
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

  getWidth(rect) {
    return rect.width - handleSize - borderWidth
  }

  getHeight(rect) {
    return rect.height - handleSize - borderWidth
  }

  handleMouseMove = (e) => {
    e.preventDefault()

    if (!this.state.dragging) {
      return
    }

    const rect = this.getRect()

    const width = this.getWidth(rect)
    const height = this.getHeight(rect)

    const x = clamp(e.pageX - rect.left, 0, width) / width
    const y = clamp(e.pageY - rect.top, 0, height) / height

    this.setState({ x, y, width, height })
  }

  getRect() {
    return ReactDOM.findDOMNode(this).getBoundingClientRect()
  }

  render(): JSX.Element {
    return (
      <div
        className={css(styles.box)}
        onMouseDown={this.handleMouseDown}
        style={{
          cursor: this.state.dragging ? 'none' : 'auto'
        }}
      >
        <div
          className={css(styles.handle)}
          style={{
            left: (this.state.x * this.state.width) + 'px',
            top: (this.state.y * this.state.height) + 'px'
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
