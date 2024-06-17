const fs = require('fs/promises')
const path = require('path')
const crypto = require('crypto')

function CacheBusterPlugin(options) {
  this.name = 'cache-buster-plugin'
  this.options = {
    hash: true,
    metadataPath: path.join(options.assetsRoot, 'metadata.json'),
    ...options,
  }
  this.writeOutputs = this.writeOutputs.bind(this)
  this.updateAsset = this.updateAsset.bind(this)
  this.createMetadataFile = this.createMetadataFile.bind(this)
}

CacheBusterPlugin.prototype.setup = function () {
  return {
    name: 'cache-buster-plugin',
    setup: build => {
      build.initialOptions.write = false
      build.onEnd(async result => {
        const assets = result.outputFiles
          .filter(file => !file.path.endsWith('.map'))
          .map(file => this.updateAsset(file, this.options.hash))

        const maps = result.outputFiles
          .filter(file => file.path.endsWith('.map'))
          .map(file => this.updateAsset(file, false))

        await this.writeOutputs([...assets, ...maps, this.createMetadataFile(assets)])
      })
    },
  }
}

CacheBusterPlugin.prototype.writeOutputs = async function (files) {
  await Promise.all(files.map(file => fs.mkdir(path.dirname(file.path), { recursive: true })))
  await Promise.all(files.map(file => fs.writeFile(file.path, file.contents)))
}

CacheBusterPlugin.prototype.createMetadataFile = function (files) {
  const assetsRoot = path.resolve(this.options.assetsRoot, '..')
  return {
    path: this.options.metadataPath,
    contents: JSON.stringify(
      Object.fromEntries(
        files.map(file => [
          `/${path.relative(assetsRoot, file.originalPath)}`,
          `/${path.relative(assetsRoot, file.path)}`,
        ]),
      ),
      null,
      2,
    ),
  }
}

CacheBusterPlugin.prototype.updateAsset = function (file, hashEnabled) {
  const hash = crypto.createHash('md5').update(file.contents).digest('hex').slice(0, 12)
  return {
    ...file,
    path: hashEnabled ? file.path.replace(/(\.[^/.]+)$/, `.${hash}$1`) : file.path,
    originalPath: file.path,
  }
}

module.exports = {
  cacheBusterPlugin: options => new CacheBusterPlugin(options).setup(),
}
