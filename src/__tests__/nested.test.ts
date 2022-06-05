import {CreateMachine} from '../index'
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

function walkingDogMachine(createMachine: CreateMachine){
  const {state, transition} = createMachine({})
  const waiting = state()
  const onAWalk = state().compound(subMachine)
  const walkComplete = state().final()

  const leaveHome = transition()
    .from(waiting).to(onAWalk)
  const arriveHome = transition()
    .from(onAWalk).to(walkComplete)
  return {
    initial: waiting,
    states: {waiting, onAWalk, walkComplete},
    transitions: {leaveHome, arriveHome},
  }
}

function subMachine(createMachine: CreateMachine) {
  const {state, transition} = createMachine({})

  const walking = state()
  const running = state()
  const sniffing = state()

  const speedUp = transition()
    .from(walking).to(running)
    .from(sniffing).to(walking)
  const stop = transition()
    .from(walking).to(sniffing)
  const speedDown = transition()
    .from(running).to(walking)
  return {
    initial: walking,
    states: {walking, running, sniffing},
    transitions: {speedUp, speedDown, stop},
  }
}
