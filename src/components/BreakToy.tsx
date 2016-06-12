import * as React from 'react'

import { initAudio, loadAudio, addEvent, play } from 'audio/audioManager'

interface State {
  ready: boolean
}

export default class BreakToy extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)

    this.state = {
      ready: false,
    }
  }

  componentDidMount(): void {
    initAudio()

    let lastTime = 0

    const cb = (str) => {
      const now = new Date().getTime()
      console.log(`${str} ${now - lastTime}`)
      lastTime = now
    }

    loadAudio().then(() => {
      for (let i = 0; i < 4; i++) {
        addEvent(i, 1, cb.bind(null, i))
      }

      this.setState({ ready: true })
    })
  }

  render(): JSX.Element {
    const { ready } = this.state

    return (
      <div>
        <h1>BreakToy</h1>

        { ready && <a onClick={play}>Play</a>}
      </div>
    )
  }
}
