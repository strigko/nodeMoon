const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const args = process.argv.slice(2);

const watchPaths = [];
let script;

for (let i = 0; i < args.length; i++) {
    if (args[i] === '--watch') {
        watchPaths.push(args[i + 1]);
        i++;
    } else {
        script = args[i];
    }
}

if (!script) {
    console.log('Specify a file to run');
    process.exit(1);
}

let child;

function start() {
    if (child) {
        child.kill();
    }

    console.log(`Starting ${script}...`);

    child = spawn('node', [script], {
        stdio: 'inherit'
    });
}

function watch(filePath) {
    const fullPath = path.resolve(filePath);

    fs.watch(fullPath, { recursive: true }, () => {
        console.log('\nFile changed. Restarting...\n');
        start();
    });
}

start();

for (const filePath of watchPaths) {
    watch(filePath);
}