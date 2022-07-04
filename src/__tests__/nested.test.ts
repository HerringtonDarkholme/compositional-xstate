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
