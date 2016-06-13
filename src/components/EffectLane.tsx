import * as React from 'react'
import { StyleSheet, css } from 'aphrodite'

import EffectStep from 'components/EffectStep'

interface Props {
  steps: number
  name: string
  type: string
}

export default (props: Props) => (
  <div className={css(styles.stepContainer)}>
    { Array.from(Array(props.steps).keys()).map(i =>
      <div className={css(styles.step)}>
        <EffectStep />
      </div>
    )}
  </div>
)

const styles = StyleSheet.create({
  stepContainer: {
    display: 'flex',
    borderRight: '1px solid #ccc',
  },
  step: {
    width: '50px',
    height: '50px',
    border: '1px solid #ccc',
    borderRight: 0,
    ':last-child': {
      borderRight: '1px solid #ccc'
    }
  }
})