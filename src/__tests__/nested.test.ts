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
  const waiting = state('waiting').initial()
  const onAWalk = state('onAWalk').compound(subMachine)
  const walkComplete = state('walkComplete').final()

  const leaveHome = transition('leaveHome')
    .connect(waiting, onAWalk)
  const arriveHome = transition('arriveHome')
    .connect(onAWalk, walkComplete)
  return {leaveHome, arriveHome}
}

function subMachine(createMachine: CreateMachine) {
  const {state, transition} = createMachine({})

  const walking = state('walking')
  const running = state('running')
  const sniffing = state('sniffing')

  const speedUp = transition('speedUp')
    .connect(walking, running)
    .connect(sniffing, walking)
  const stop = transition('stop')
    .connect(walking, sniffing)
  const speedDown = transition('speedDown')
    .connect(running, walking)

  return {speedUp, speedDown, stop}
}
