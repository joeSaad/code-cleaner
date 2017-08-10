#! /usr/bin/env node

const fs = require('fs')
const path = require('path')
const {promisify} = require('util')
const readDirAsync = promisify(fs.readdir)
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)

const program = require('commander')
const pkg = require('./package.json');

let dirToClean

function analyzeInput() {
	let directoryPresent = false
	if (process.argv.length > 1) {
		if (process.argv.filter(t=> t.startsWith('-'))[0]) {
			let flag = process.argv.filter(t=> t.startsWith('-'))[0]
			let flag_i = process.argv.indexOf(flag)
			switch(flag) {
			    case '-h':
			        console.log('This package helps you clean your code\n')
			        console.log('-d helps you determine the directory\n')
			        break;
			    case '-v':
			        console.log(pkg.version)
			        break;
			    case '-d':
					if (process.argv.length < 4) {
						console.log('ERROR - Please enter directory')
						break
					}
					directoryPresent = true
					dirToClean = path.resolve(__dirname,process.argv[2])
			        break;
			    default:
					directoryPresent = true
					dirToClean = path.resolve(__dirname,process.argv[2])	
			        break;
			}
			process.argv.splice(flag_i, 1)
		}
		if (process.argv.indexOf('.') > -1) {
			directoryPresent = true
			dirToClean = __dirname
		}
	}	
	return directoryPresent
}

//analyzeInput()

/*if (analyzeInput()) {
	console.log('process.argv.length : '+process.argv.length);
	console.log('directoryPresent : '+directoryPresent);
}
else {
	if (process.argv.length < 3) {
		console.log('name of file not entered')
		return
	}
	else {
		console.log('process.argv.length : '+process.argv.length);
		const fileToClean = process.argv[2]
		console.log('fileToClean : '+fileToClean);
	}
}*/

const userInput = process.argv;


/*switch(userInput){
	case this.includes('-v'):
		console.log(pkg.version)
		break;
	case this.includes('-d'):
		if (userInput.length < 4) {
			console.log('ERROR - Please enter directory')
			break
		}
		dirToClean = path.resolve(__dirname,process.argv[2])
		break;
	case this.includes('.'):
		dirToClean = __dirname
		break
	default: 
		console.log('file is')
}*/

program
	.version(pkg.version)
	.usage('[options] <file ...>')
	.option('-v, --version', 'Get version')
	.option('-d, --directory', 'Clean directory files')
	.option('., --directory', 'Clean directory files')
	.parse(process.argv)

	if (program.directory) {
		dirToClean = process.cwd()
		cleanByDirectory(dirToClean)
		console.log('  - directory: '+ dirToClean)
	}
	else{
		const fileToClean = process.argv[2]
		console.log('fileToClean : '+fileToClean);
		cleanFile(fileToClean)
	}



/*console.log('userInput.length : '+userInput.length);
console.log('process.argv : '+process.argv);
console.log('dirToClean : '+dirToClean);
*/
/*if (process.argv.includes('-d')) {
	dirToClean = path.resolve(__dirname,process.argv.slice(3,4)[0])	
	console.log('dirToClean : '+dirToClean);
	cleanByDirectory(dirToClean)
}
else {
	const fileToClean = process.argv.slice(2,3)[0]
	cleanFile(fileToClean)
}
*/

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

