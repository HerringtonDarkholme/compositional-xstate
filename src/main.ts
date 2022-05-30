import { inspect } from '@xstate/inspect';
import { inspectMachine, CreateMachine } from './index'
import './styles/main.css'

inspect({
  // options
  iframe: document.getElementsByTagName('iframe')[0] // open in new window
});

function defineMachine(c: CreateMachine) {
  const g = c()
  const pending = g.state('pending')
  const resolved = g.state('resolved')
  const rejected = g.state('rejected')
  g.transition('RESOLVE').from(pending).to(resolved)
  g.transition('REJECT').from(pending).to(rejected)
  return pending
}

function walkDogMachine(createMachine: CreateMachine) {
  // create initial context here
  const g = createMachine()

  // declare all states
  const waiting = g.state('waiting')
  const onAWalk = g.state('on a walk').compound(onWalkSubMachine)
  const walkComplete = g.state('walk complete').final()

  // declare all transitions
  g.transition('leaveHome')
    .from(waiting).to(onAWalk)
  g.transition('arriveHome')
    .from(onAWalk).to(walkComplete)

  // return initial state
  return waiting
}

// sub state machine
function onWalkSubMachine(createMachine: CreateMachine) {
  const g = createMachine()

  const walking = g.state('walking')
  const running = g.state('running')
  const sniffing = g.state('stopping to sniff good smells')

  g.transition('speed up')
    .from(walking).to(running)
    .from(sniffing).to(walking)
  g.transition('stop')
    .from(walking).to(sniffing)
  g.transition('slowDown')
    .from(running).to(walking)
  return walking
}

document.getElementById('app')!.textContent = defineMachine.toString()

inspectMachine(walkDogMachine)

