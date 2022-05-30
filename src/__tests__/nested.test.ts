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
  const g = createMachine({})
  const waiting = g.state('waiting')
  const onAWalk = g.state('on a walk').compound(subMachine)
  const walkComplete = g.state('walk complete').final()

  g.transition('leaveHome')
    .from(waiting).to(onAWalk)
  g.transition('arriveHome')
    .from(onAWalk).to(walkComplete)
  return waiting
}

function subMachine(createMachine: CreateMachine) {
  const g = createMachine({})

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
