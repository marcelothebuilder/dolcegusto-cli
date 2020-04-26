const fs = require('fs')

const UPX = require('upx')({
  best: true,
  overlayCopy: true
})

const PLATFORMS = [
  { name: 'linux' },
  { name: 'macos' },
  { name: 'win', suffix: 'exe' }
]

PLATFORMS.forEach(({ name, suffix }) => {
  const suffixS = suffix ? ('.' + suffix) : ''
  const source = `bin/dolcegusto-cli-${name}` + suffixS
  const dest = `bin/upx.dolcegusto-cli-${name}` + suffixS

  fs.unlinkSync(dest)

  console.log(`Compressing ${name}, (${source} -> ${dest})`)
  UPX(source)
    .output(dest)
    .start()
    .then((stats) => {
      console.log(`Compressed ${name}`, stats)
    })
    .catch((e) => {
      console.error(`Failed to compress ${name}`, e)
    })
})
