var Transition: any

class Pending {
  static tag = ''
  static description = ''
  resolve = Transition().to(Resolved)
  reject = Transition().to(Rejected)
}

class Resolved {
  static isFinal = true
}
const ALWAYS = 'test'
class Rejected  {
  onDone = Transition.to()
}

