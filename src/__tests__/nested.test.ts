import {state, createStateMachine, transition} from '../index'
/*
const machine = createMachine({
  initial: "waiting",
  states: {
    waiting: {
      on: {
        "leave home": {
          target: "on a walk",
        },
      },
    },
    "on a walk": {
      initial: "walking",
      on: {
        "arrive home": {
          target: "walk complete",
        },
      },
      states: {
        walking: {
          on: {
            "speed up": {
              target: "running",
            },
            stop: {
              target: "stopping to sniff good smells",
            },
          },
        },
        running: {
          on: {
            "slow down": {
              target: "walking",
            },
          },
        },
        "stopping to sniff good smells": {
          on: {
            "speed up": {
              target: "walking",
            },
          },
        },
      },
    },
    "walk complete": {},
  },
});
*/

const walking = state()
const running = state()
const sniffing = state('stopping to sniff good smells')

const speedUp = transition()
  .from(walking).to(running)
  .from(sniffing).to(walking)
const stop = transition().from(walking).to(sniffing)
const slowDown = transition().from(running).to(walking)

const waiting = state()
const onAWalk = state().compound({
  states: {walking, running, sniffing},
  transitions: { speedUp, stop, slowDown },
})
const walkComplete = state().final()


const leaveHome = transition().from(waiting).to(onAWalk)

createStateMachine({
  states: {waiting, onAWalk, walkComplete},
  transitions: {leaveHome}
})
