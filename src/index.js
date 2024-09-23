const fridaScriptLoader = require('./fridaScriptLoader');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

const argv =  yargs
.option('output', {
    alias: 'o',
    type: 'string',
    description: 'Output file path',
    demandOption: false
})
.option('watch',{
    alias: 'w',
    type: 'boolean',
    description: 'Is watching file?',
    demandOption: false,
    default:false
})
.help()
.argv;

function build(inputPath,outputPath)
{
    let loader = fridaScriptLoader.loadScript(inputPath);
    fs.writeFileSync(outputPath,loader.finalText);
    console.log(`${inputPath} generate to ${outputPath}.`);
}

function main()
{
    let inputPath = argv._[0];
    if(!inputPath || !fs.existsSync(inputPath))
    {
        console.error(`File is not exist or null input!`);
        return -1;
    }
    
    let outputPath = argv.output;
    if(!outputPath)
    {
        let ext = path.extname(inputPath);
        outputPath =`${path.basename(inputPath,ext)}_g${ext}`;
    }

    build(inputPath,outputPath);

    if(argv.watch)
    {
        fs.watchFile(inputPath, (curr, prev) => {
            build(inputPath,outputPath);
        });
    }
}

main()