fs = require('fs')
fs.readFile('test.html', 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }

  const reHTML = /<!--(.*?)-->/g;
  const reInline = /\/\//g;

  const removeables = {
    html: /<!--(.*?[\s\S]*)-->/gm,
    inline: /\/\/(.*)?/g,
    console: /(console.*)/g,
    empty: /^\s*$/gm,
  }

  let pdata = data;
  for (let key in removeables) {
    pdata = pdata.replace(removeables[key], '')
  }

  console.log(pdata);
  fs.writeFile('test.html', pdata, (err) => {
    console.log('completed');
  })

});