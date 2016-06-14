import * as React from 'react'

import BreakToy from 'components/BreakToy'
import EventStore from 'stores/EventStore'

const eventStore = new EventStore()

export default () => <BreakToy eventStore={eventStore} />
