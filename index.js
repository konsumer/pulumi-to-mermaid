export default function getUML (stack) {
  const steps = stack.steps.filter(s => s && s.op !== 'delete').map(s => s.newState)
  const config = stack.config

  // TODO: this does nothing
  return { steps, config }
}
