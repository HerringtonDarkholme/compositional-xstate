import { interpret, createMachine, MachineConfig as OriginalConfig } from 'xstate';
type XStateConfig = OriginalConfig<any, any, any>

export function interpretMachine<T>(config) {
  const machine = createMachine(config)
  return interpret(machine, { devTools: true }) as any // TODO
}
