#! /usr/bin/env node

const fs = require('fs')
const path = require('path')
const {promisify} = require('util')
const readDirAsync = promisify(fs.readdir)
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)

const program = require('commander')
const colors = require('colors')
const pkg = require('./package.json');

let dirToClean

const userInput = process.argv;

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
		console.log(`Files at ${dirToClean} are cleaned 👍🏼`.bgGreen)

	}
	else{
		const fileToClean = process.argv[2]
		cleanFile(fileToClean)
		console.log(`File ${fileToClean} cleaned 👍🏼`.bgGreen)
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
}

function readDirR(dir) {
    return fs.statSync(dir).isDirectory()
        ? Array.prototype.concat(...fs.readdirSync(dir).map(f => readDirR(path.join(dir, f))))
        : dir;
}

