const execSync = require('child_process').execSync
const fs = require('fs')

const cmd1 = 'git init'
let cmd2 = 'git remote add -f origin '
const cmd3 = 'git config core.sparsecheckout true'
const cmd4 = 'git pull origin master'

let path = ''

process.stdin.setEncoding('utf8')
process.stdout.write('请输入仓库远程地址，以及想要复制的文件路径？两个输入以及多个路径都用空格分开:\n')
process.stdin.on('data', data => {
  console.log(data)
  cmd2 += data.split(' ')[0]
  path = data.slice(data.indexOf(' ') + 1).split(' ').join('\n')
  process.stdin.emit('end')
})

process.stdin.on('end', () => {
  execSync(cmd1)
  console.log('完成度：25%')
  execSync(cmd2)
  console.log('完成度：50%')
  execSync(cmd3)
  console.log('完成度：75%')
  fs.writeFileSync('./.git/info/sparse-checkout', path)
  execSync(cmd4)
  console.log('It\'s ok!')
})