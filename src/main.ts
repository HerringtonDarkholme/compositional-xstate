import { inspect } from '@xstate/inspect';
import { interpretMachine, CreateMachine } from './index'
import './styles/main.css'

inspect({
  // options
  iframe: document.getElementsByTagName('iframe')[0] // open in new window
});



// document.getElementById('app')!.textContent = defineMachine.toString()
