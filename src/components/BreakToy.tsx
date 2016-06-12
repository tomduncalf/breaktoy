import * as React from 'react'

import { loadAudio, play } from 'audio/audioManager'

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
    loadAudio().then(() => this.setState({ ready: true }))
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
