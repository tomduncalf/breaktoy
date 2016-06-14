import { observable, map } from 'mobx'

export default class EventStore {
  @observable events = map()
}
