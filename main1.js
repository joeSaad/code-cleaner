fs = require('fs')
fs.readFile('test.html', 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }

  const removeables = {
    html: /<!--(.*?[\s]*)-->/gm,
    inline: /\/\/(.*)?/g,
    //mline: /\/\*.*\*\//g,
    mline: /\/\*.*[\s\S]*\*\//gm,
    console: /(console.*)/g,
    //empty: /^\s*$/gm,
    //empty: /^\s*\n/gm
    empty: /^\s*[\r\n]/gm
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