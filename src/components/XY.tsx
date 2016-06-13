import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { StyleSheet, css } from 'aphrodite'
const clamp = require('clamp')

interface State {
  dragging?: boolean
  width?: number
  height?: number
  mouseMoved?: boolean
}

interface Props {
  onChange: (x: number, y: number) => void
  onClick?: () => void
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

  // Should really call onResize
  componentDidMount(): void {
    setTimeout(() => {
      const rect = this.getRect()

      const width = this.getWidth(rect)
      const height = this.getHeight(rect)

      this.setState({ width, height })
    }, 0)
  }

  handleMouseDown = (e) => {
    e.preventDefault()

    this.setState({ dragging: true, mouseMoved: false })

    window.addEventListener('mouseup', this.handleMouseUp)
    window.addEventListener('mousemove', this.handleMouseMove)
  }

  handleMouseUp = () => {
    this.setState({ dragging: false })

    if (!this.state.mouseMoved) {
      this.props.onClick()
    }

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

    const { width, height } = this.state

    const x = clamp(e.pageX - rect.left, 0, width) / width
    const y = clamp(e.pageY - rect.top, 0, height) / height

    this.setState({ mouseMoved: true })
    this.props.onChange(x, y)
  }

  getRect() {
    return ReactDOM.findDOMNode(this).getBoundingClientRect()
  }

  render(): JSX.Element {
    const styles = getStyles(this.props)
    const { width, height } = this.state
    const shouldRenderHandle = !!(width && height)

    return (
      <div
        className={css(styles.box)}
        onMouseDown={this.handleMouseDown}
        style={{
          cursor: this.state.dragging ? 'none' : 'auto'
        }}
      >
        { shouldRenderHandle &&
          <div
            className={css(styles.handle) }
            style={{
              left: (this.props.x * width) + 'px',
              top: (this.props.y * height) + 'px'
            }}
          ></div>
        }
      </div>
    )
  }
}

const getStyles = (props: Props) => StyleSheet.create({
  box: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },

  handle: {
    width: (props.handleSize || handleSize) + 'px',
    height: (props.handleSize || handleSize) + 'px',
    backgroundColor: props.handleColor || 'transparent',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: props.handleColor || '#666',
    borderRadius: (props.handleSize || handleSize) + 'px',
    position: 'absolute',
  }
})
