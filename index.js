const fs = require('fs')
const path = require('path')
const {promisify} = require('util')
const readDirAsync = promisify(fs.readdir)
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)

let dirToClean

if (process.argv.includes('-d')) {
	dirToClean = path.resolve(__dirname,process.argv.slice(3,4)[0])	
	console.log('dirToClean : '+dirToClean);
	cleanByDirectory(dirToClean)
}
else {
	const fileToClean = process.argv.slice(2,3)[0]
	cleanFile(fileToClean)
}


const removeables = {
	html: /<!--(.*?[\s]*)-->/gm,
	inline: /\/\/(.*)?/g,
	mline: /\/\*.*[\s\S]*\*\//gm,
	console: /(console.*)/g,
	empty: /^\s*[\r\n]/gm
}

async function readD(directory){
	try{
		const dirArr = await readDirAsync(directory)
		return dirArr
	}
	catch(error){
		console.log('ERROR : '+error);
	}
}


async function readF(mfile) {
    try {
        const text = await readFileAsync(mfile, {encoding: 'utf8'});
        return text;
    }
    catch (err) {
        console.log('ERROR:', err);
    }
}

async function writeF(mfile, data){
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

function cleanFile(file){
	readF(file).then(d=> writeF(file,d))
}

function cleanByDirectory(dir) {
	const dirt = readDirR(dirToClean);
	dirt.forEach(f=>{
		const rf = path.resolve(dir,f);
		cleanFile(rf)
		})
	console.log('\x1b[32m%s\x1b[0m', 'files cleaned')
	
}

function readDirR(dir) {
    return fs.statSync(dir).isDirectory()
        ? Array.prototype.concat(...fs.readdirSync(dir).map(f => readDirR(path.join(dir, f))))
        : dir;
}

