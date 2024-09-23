const { execSync } = require('child_process');
try
{
    execSync('git submodule init && git submodule update');
}catch(err)
{
    console.log(`Error on prepare frida-g : ${err}`);
}