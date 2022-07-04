import {State, transition, Machine} from '../types'

class Pending extends State {
  static tag = ''
  static description = ''
  resolve = transition()
    .to(Resolved).when(() =>  true).action()
  reject = transition().to(Rejected)
}

class Resolved extends State {
  static isFinal = true
}
class Rejected  extends State {
  static isFinal = true
}


const promiseMachine = new Machine(Pending)

promiseMachine.send('resolve')
