import * as React from 'react'

import { initAudio, loadAudio, addEvent, play } from 'audio/audioManager'

import XY from 'components/XY'

interface State {
  ready?: boolean
  playing?: boolean
}

export default class BreakToy extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)

    this.state = {
      ready: false,
      playing: false,
    }
  }

  componentDidMount(): void {
    initAudio()

    loadAudio().then(() => {
      addEvent(2, 1, { type: 'delay', value: 1 })
      addEvent(2.5, 1, { type: 'delay', value: 0 })
      addEvent(4, 1, { type: 'delay', value: 1 })
      addEvent(4.5, 1, { type: 'delay', value: 0 })

      this.setState({ ready: true })
    })
  }

  play(): void {
    play()
    this.setState({ playing: true })
  }

  render(): JSX.Element {
    const { ready, playing } = this.state

    return (
      <div>
        <h1>BreakToy</h1>

        <XY />

        { ready && !playing && <a onClick={this.play.bind(this)}>Play</a>}
        { ready && playing && <a>Stop</a> }
      </div>
    )
  }
}
