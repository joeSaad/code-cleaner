fs = require('fs')

const mfile = "myfile.txt"

// async and wait currently not working
async function readAndProcess() {
  let content = await fs.readFile(mfile, 'utf8')

  const removeables = {
    html: /<!--(.*?[\s\S]*)-->/gm,
    inline: /\/\/(.*)?/g,
    console: /(console.*)/g,
    empty: /^\s*$/gm,
  }

  const result = content.replace(removeables.html, '').replace(removeables.inline, '').replace(removeables.console, '').replace(removeables.empty, '')

  return result

}


readAndProcess.then(v => {
  console.log(v);
})