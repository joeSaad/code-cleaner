fs = require('fs')
fs.readFile('i1.txt', 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }


  //var re = /see (chapter \d+(\.\d)*)/i;
  const reHTML = /<!--(.*?)-->/g;
  const reInline = /\/\//g;

  const removeables = {
    html: /<!--(.*?[\s\S]*)-->/gm,
    inline: /\/\/(.*)?/g,
    console: /(console.*)/g,
    empty: /^\s*$/gm,
  }


  //const mdata = data.replace(/<!--(.*?[\s\S]*)-->/gm, '')
  const mdata = data.replace(removeables.html, '')
                    .replace(removeables.inline, '')
                    .replace(removeables.console, '')
                    .replace(removeables.empty, '')

  let pdata = data;
  for (let key in removeables) {
    pdata = pdata.replace(removeables[key], '')
  }

  console.log(pdata);
  fs.writeFile('i1.txt', pdata, (err) => {
    console.log('completed');
  })

});