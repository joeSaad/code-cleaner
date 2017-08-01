fs = require('fs')

const mfile = "myfile.txt"

  const removeables = {
      html: /<!--(.*?[\s\S]*)-->/gm,
      inline: /\/\/(.*)?/g,
      console: /(console.*)/g,
      empty: /^\s*$/gm,
    }

// async and wait currently not working
async function readAndProcess() {
  let content
  try {
    content = await fs.readFile(mfile, 'utf8')    
    return content;
  }
  catch(error){
    console.log(error)
  }
  

}


readAndProcess.then(content => {

    const result = content.replace(removeables.html, '').replace(removeables.inline, '').replace(removeables.console, '').replace(removeables.empty, '')    
})