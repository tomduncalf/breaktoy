import * as React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { ObservableMap } from 'mobx'
import { observer } from 'mobx-react'

import { addEvent, clearEvent, updateEvent, EffectType } from 'audio/audioManager'

import EffectStep from 'components/EffectStep'

interface Props {
  steps: number
  name: string
  type: EffectType
  events: ObservableMap<any>
}

const EffectLane = (props: Props) => {
  console.log('render effectlane')
  return <div className={css(styles.stepContainer)}>
    { Array.from(Array(props.steps).keys()).map(i =>
      <div className={css(styles.step)}>
        <EffectStep
          id={i}
          onEnable={addStep(i, props.type)}
          onDisable={clearStep(i, props.type)}
          onChange={updateStep(i, props.type)}
        />
      </div>
    )}
    { props.events.size }
  </div>
}

export default observer(EffectLane)

const idToBeat = (id: number): number => (id / 4) + 1

type StepFunction = (id: number, type: EffectType) => (x: number, y: number) => void

const addStep: StepFunction = (id, type) =>
  (x, y) => {
    addEvent(idToBeat(id), 1, { type, xValue: x, yValue: y })
  }

const clearStep = (id: number, type: EffectType): () => void => () =>
  clearEvent(idToBeat(id))

const updateStep: StepFunction = (id, type) =>
  (x, y) => {
    updateEvent(idToBeat(id), x, y)
  }

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
      borderRight: '1px solid #ccc',
    },
  },
})
