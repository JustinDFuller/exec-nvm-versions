#!/usr/bin/env node

const benchmarkNvm = require('../')
const [, , benchmarkPath] = process.argv

if (benchmarkPath === undefined) {
  throw new Error(
    'BenchmarkPath required. Usage: "benchmarkNvm /path/to/benchmarkFile.js"'
  )
}

benchmarkNvm(benchmarkPath)
