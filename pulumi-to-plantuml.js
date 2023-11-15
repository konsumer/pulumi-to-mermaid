#!/usr/bin/env node

import { readFile } from 'fs/promises'
import getUML from './index.js'

const [,, filename] = process.argv

const getCodeStdin = () => new Promise((resolve) => {
  let json = ''
  process.stdin.resume()
  process.stdin.setEncoding('utf8')
  process.stdin.on('data', (chunk) => json += chunk)
  process.stdin.on('end', () => {
    resolve(JSON.parse(json))
  })
})

const getCodeFile = async f => JSON.parse(await readFile(f, 'utf8'))

let stack
if (filename) {
  stack = await getCodeFile(filename)
} else {
  stack = await getCodeStdin()
}

console.log(getUML(stack))
