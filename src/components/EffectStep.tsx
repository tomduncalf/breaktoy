import * as React from 'react'
import { StyleSheet, css } from 'aphrodite'

import XY from 'components/XY'

interface Props {
  id: number
  onEnable: (x: number, y: number) => void
  onDisable: () => void
  onChange: (x: number, y: number) => void
}

interface State {
  x?: number
  y?: number
  enabled?: boolean
}

export default class EffectStep extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      x: 0,
      y: 0,
      enabled: false,
    }
  }

  handleXYChange = (x, y): void => {
    this.setState({ x, y })
    this.props.onChange(x, y)
  }

  toggleEnabled = (): void => {
    const { x, y, enabled } = this.state

    if (!enabled) {
      this.props.onEnable(x, y)
    } else {
      this.props.onDisable()
    }

    this.setState({ enabled: !enabled })
  }

  render(): JSX.Element {
    return (
      <div className={css(styles.container)}>
        <XY
          onChange={this.handleXYChange}
          x={this.state.x}
          y={this.state.y}
          handleColor='#f00'
          onClick={this.toggleEnabled}
          enabled={this.state.enabled}
        />
        {/*this.state.x} {this.state.y*/}
      </div>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  disabled: {
    width: '100%',
    height: '100%',
    backgroundColor: '#eee',
  },
})
