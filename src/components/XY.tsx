import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { StyleSheet, css } from 'aphrodite'
const clamp = require('clamp')

interface State {
  dragging?: boolean
  width?: number
  height?: number
}

interface Props {
  onChange: (x: number, y: number) => void
  x: number
  y: number
  handleSize?: number
  handleColor?: string
}

const handleSize = 10
const borderWidth = 1

export default class XY extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
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

    this.setState({ width, height })
    this.props.onChange(x, y)
  }

  getRect() {
    return ReactDOM.findDOMNode(this).getBoundingClientRect()
  }

  render(): JSX.Element {
    const styles = getStyles(this.props)

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
            left: (this.props.x * this.state.width) + 'px',
            top: (this.props.y * this.state.height) + 'px'
          }}>
          </div>
      </div>
    )
  }
}

const getStyles = (props: Props) => StyleSheet.create({
  box: {
    width: '100px',
    height: '100px',
    border: borderWidth + 'px solid #ccc',
    position: 'relative',
  },

  handle: {
    width: (props.handleSize || handleSize) + 'px',
    height: (props.handleSize || handleSize) + 'px',
    backgroundColor: props.handleColor || 'transparent',
    borderWidth: '2px',
    borderStyle: 'solid'
    borderColor: props.handleColor || '#666',
    borderRadius: (props.handleSize || handleSize) + 'px',
    position: 'absolute',
  }
})
