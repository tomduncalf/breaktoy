import * as React from 'react'
import { render } from 'react-dom'
const { AppContainer } = require('react-hot-loader')

import App from 'containers/App'

const rootEl = document.getElementById('container')

render(
  <AppContainer>
    <App />
  </AppContainer>,
  rootEl
)

declare var module: any

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    const NextApp = require('./containers/App').default;
    render(
      <AppContainer>
         <NextApp />
      </AppContainer>,
      rootEl
    )
  })
}
