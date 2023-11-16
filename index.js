
// TODO: need lots more
export const views = {
  generic: (step) => `${step.type}["${step.type}"]`,
  'pulumi:pulumi:Stack': (step, urn) => `${urn.itemName}["fa:fa-layer-group Stack: ${urn.stack}"]`,
  'cloud:service:Service': (step, urn) => `${urn.itemName}["fa:fa-server ${urn.itemName}"]`,
  'cloud:global:infrastructure': () => false,
  'aws:iam/role:Role': () => false,
  'aws:ecr/repository:Repository': () => false,
  'aws:iam/rolePolicyAttachment:RolePolicyAttachment': () => false,
  'aws:cloudwatch/logGroup:LogGroup': () => false,
  'awsx:cluster:Cluster': () => false,
  'aws:cloudwatch/logGroup:LogGroup': () => false,
  'aws:ecs/cluster:Cluster': () => false,
  'aws:ecr/lifecyclePolicy:LifecyclePolicy': () => false,
  'aws:ecs/taskDefinition:TaskDefinition': () => false,
  'awsx:network:Network': () => false,
  'aws:ec2/securityGroup:SecurityGroup': () => false,
  'aws:ecs/service:Service': () => false,
  'aws:s3/bucket:Bucket': (step, urn) => `${urn.itemName}{{"fa:fa-bucket ${urn.itemName}"}}`
}

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
let lettercounter = 0

function letter () {
  lettercounter++
  if (lettercounter > letters.length) {
    const l = lettercounter % letters.length
    return letters[l] + letters[l]
  }
  return letters[lettercounter]
}

export function urnParse (urn) {
  const [, stack, project, type, itemName] = /urn:pulumi:([a-zA-Z0-9\\-]+)::([a-zA-Z0-9\\-]+)::(.+)::(.+)/.exec(urn) || []
  return { stack, project, type, itemName }
}

export function relationships (steps) {
  // TODO
  return ''
}

export default function getUML (stack) {
  const steps = stack.steps.filter(s => s && s.op !== 'delete').map(s => s.newState)
  const config = stack.config

  const stackOp = steps.find(s => s.urn.includes('pulumi:pulumi:Stack::'))

  if (!stackOp) {
    throw new Error('stack not found.')
  }

  const source = steps.map((step, i) => {
    // console.log(step.urn)
    return views[step.type] ? views[step.type](step, urnParse(step.urn || '')) : views.generic(step, urnParse(step.urn || ''))
  })

  source.unshift('flowchart TD')
  return source.filter(s => s).join('\n') + relationships(source)
}
