#! /usr/bin/env node

const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const readDirAsync = promisify(fs.readdir)
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)

const program = require('commander')
const colors = require('colors')
const pkg = require('./package.json')

let dirToClean

const { filesSupported } = require('./config.json')

const userInput = process.argv

program
    .version(pkg.version)
    .usage('[options] <file ...>')
    .option('-d, --directory', 'Clean given directory files')
    .option('., --directory', 'Clean current directory files')
    .parse(process.argv)

if (program.directory) {
    dirToClean =
        process.argv[3] === undefined ?
        process.cwd() :
        path.resolve(process.argv[3])
    cleanByDirectory(dirToClean)
    console.log(`Files at ${dirToClean} are cleaned 👍🏼`.bgGreen)
} else {
    const fileToClean = process.argv[2]
    const fileExt = fileToClean.substr(fileToClean.indexOf('.') + 1)
    const rf = path.resolve(path.dirname(fileToClean), path.basename(fileToClean))
    if (filesSupported.includes(fileExt)) {
        //cleanFile(fileToClean)
        cleanFile(rf)
        console.log(`File ${fileToClean} cleaned 👍🏼`.bgGreen)
    } else {
        console.log(`File ${fileToClean} is not supported ❌`.bgRed)
        console.log(
            `Files to clean have to have one of the following extensions: ${filesSupported.join(
        ','
      )}`
        )
    }
}

const removeables = {
    html: /<!--(.*?[\s\S]*)-->/gm,
    inline: /\/\/(.*)?/g,
    mline: /\/\*.*[\S]*\*\//gm,
    console: /(console.*)/g,
    debugged: /(debugger.*)/g,
    empty: /^\s*[\r\n]/gm,
}

async function readD(directory) {
    try {
        const dirArr = await readDirAsync(directory)
        return dirArr
    } catch (error) {
        console.log('ERROR : ' + error)
    }
}

async function readF(mfile) {
    try {
        const text = await readFileAsync(mfile, {
            encoding: 'utf8',
        })
        return text
    } catch (err) {
        console.log('ERROR:', err)
    }
}

async function writeF(mfile, data) {
    try {
        let pdata = data
        for (let key in removeables) {
            pdata = pdata.replace(removeables[key], '')
        }
        const written = await writeFileAsync(mfile, pdata)
    } catch (err) {
        console.log('ERROR: ', err)
    }
}

function cleanFile(file) {
    readF(file).then((d) => writeF(file, d))
}

function cleanByDirectory(dir) {
    const dirt = readDirR(dirToClean)
    dirt.forEach((f) => {
        const rf = path.resolve(dir, f)
        const rfExtention = rf.substr(rf.indexOf('.') + 1)
        if (filesSupported.includes(rfExtention)) {
            cleanFile(rf)
        } else return
    })
}

function readDirR(dir) {
    return fs.statSync(dir).isDirectory() ?
        Array.prototype.concat(
            ...fs.readdirSync(dir).map((f) => readDirR(path.join(dir, f)))
        ) :
        dir
}