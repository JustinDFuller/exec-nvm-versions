const { exec } = require('child_process')
const { promisify } = require('util')
const path = require('path')
const fs = require('fs')

const execAsync = promisify(exec)
const readDirAsync = promisify(fs.readdir)

function nodePathFromStdout({ stdout }) {
  return path.resolve(stdout, '../../../')
}

function getNodeVersionPaths(nodePath) {
  function versionToNodePath(version) {
    return {
      version,
      path: path.join(nodePath, version, 'bin/node')
    }
  }

  function mapVersionsToNodePaths(versions) {
    return versions.map(versionToNodePath)
  }

  return readDirAsync(nodePath)
    .then(mapVersionsToNodePaths)
}

function executeBenchmarkPath(benchmarkPath) {
  return function executeNodePaths([nodePath, ...nodePaths]) {
    if (nodePath === undefined) {
      console.log('Executed all node versions.')
      return
    }

    function recurseNodePaths(results) {
      console.log(results.stdout)
      return executeNodePaths(nodePaths)
    }
    
    const command = `${nodePath.path} ${benchmarkPath}`
    console.log(`Executing benchmark > ${command}`)
    return execAsync(command).then(recurseNodePaths)
  }
}

module.exports = function (benchmarkPath) {
  return execAsync('which node')
    .then(nodePathFromStdout)
    .then(getNodeVersionPaths)
    .then(executeBenchmarkPath(benchmarkPath))
}
