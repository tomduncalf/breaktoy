import * as React from 'react'
import { StyleSheet, css } from 'aphrodite'

import XY from 'components/XY'

interface State {
  x?: number
  y?: number
  enabled?: boolean
}

export default class BreakToy extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)

    this.state = {
      x: 0,
      y: 0,
      enabled: false,
    }
  }

  handleXYChange = (x, y): void => {
    this.setState({ x, y })
  }

  toggleEnabled = (): void => {
    this.setState({ enabled: !this.state.enabled })
  }

  render(): JSX.Element {
    return (
      <div className={css(styles.container)}>
        { this.state.enabled ?
          <XY
            onChange={this.handleXYChange}
            x={this.state.x}
            y={this.state.y}
            handleColor='#f00'
            onClick={this.toggleEnabled}
          />
        :
          <div className={css(styles.disabled)} onClick={this.toggleEnabled}>
          </div>
        }
      </div>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%'
  },
  disabled: {
    width: '100%',
    height: '100%',
    backgroundColor: '#eee',
  }
})