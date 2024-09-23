const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname,'..', 'FridaScript');

if (!fs.existsSync(dir)) {
  exec('git clone https://github.com/pgw00k/FridaScript.git --depth 1', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error cloning repo: ${err}`);
      return;
    }
    console.log(stdout);
  });
} else {
  console.log('FridaScript directory already exists, skipping clone.');
}
