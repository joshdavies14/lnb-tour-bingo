import JsonSession from './JsonSession'

// Always guaranteed to return data:
// either retrieved from the JsonSession,
// or created using the init function
class GuaranteedJsonSession<T> {
  private session: JsonSession<T>
  private initFunction: () => T

  constructor(initFunction: () => T) {
    this.session = new JsonSession<T>()
    this.initFunction = initFunction
  }

  get sessionData(): T {
    return this.session.sessionData || this.initSessionData()
  }

  set sessionData(list: T) {
    this.session.sessionData = list
  }

  private initSessionData(): T {
    const data = this.initFunction()
    this.session.sessionData = data

    return data
  }
}

export default GuaranteedJsonSession
