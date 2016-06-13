import * as React from 'react'

import { initAudio, loadAudio, addEvent, play } from 'audio/audioManager'

import EffectLane from 'components/EffectLane'

interface State {
  ready?: boolean
  playing?: boolean
  x?: number
  y?: number
}

export default class BreakToy extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)

    this.state = {
      ready: false,
      playing: false,
      x: 0,
      y: 0,
    }
  }

  componentDidMount(): void {
    initAudio()

    loadAudio().then(() => {
      /*addEvent(2, 1, { type: 'delay', value: 1 })
      addEvent(2.5, 1, { type: 'delay', value: 0 })
      addEvent(4, 1, { type: 'delay', value: 1 })
      addEvent(4.5, 1, { type: 'delay', value: 0 })*/

      this.setState({ ready: true })
    })
  }

  play(): void {
    play()
    this.setState({ playing: true })
  }

  handleXYChange = (x, y): void => {
    this.setState({ x, y })
  }

  render(): JSX.Element {
    const { ready, playing } = this.state

    return (
      <div>
        <h1>BreakToy</h1>

        <EffectLane name='Delay' type='delay' steps={16} />

        { ready && !playing && <a onClick={this.play.bind(this)}>Play</a>}
        { ready && playing && <a>Stop</a> }
      </div>
    )
  }
}
