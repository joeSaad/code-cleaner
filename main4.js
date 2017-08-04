const fs = require('fs')
const {promisify} = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);


const qfile = "test.html"
//const mfile = __dirname;

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


fs.readdir(__dirname, (err, files) => {
  files.forEach(file => {
    console.log(file);
  });
})


/*readFileAsync(mfile, {encoding: 'utf8'})
  .then((data) => {
  	let pdata = data;
	  for (let key in removeables) {
	    pdata = pdata.replace(removeables[key], '')
	  }
  		fs.writeFile(mfile, pdata, (err) => {
		    console.log('completed');
		  })
  })
  .catch((err) => {
      console.log('ERROR:', err);
  })*/

async function readf(mfile) {
    try {
        const text = await readFileAsync(mfile, {encoding: 'utf8'});
        //console.log('CONTENT:', text);
        return text;
    }
    catch (err) {
        console.log('ERROR:', err);
    }
}

async function writef(mfile, data){
	try{
		let pdata = data;
		for (let key in removeables) {
			pdata = pdata.replace(removeables[key], '')
		}
		const written = await writeFileAsync(mfile, pdata)
	}
	catch(err){
		console.log('ERROR: ', err)
	}
}

/*readf().then(data=>{
	let pdata = data;
	  for (let key in removeables) {
	    pdata = pdata.replace(removeables[key], '')
	  }
	  fs.writeFile(mfile, pdata, (err) => {
	    console.log('completed');
	  })
})*/

readf(qfile).then(d=> writef(qfile,d))