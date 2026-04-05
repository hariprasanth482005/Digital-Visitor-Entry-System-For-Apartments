const path = require('path');
const fs = require('fs');

const baseDir = 'c:/Users/Hari Prasanth/OneDrive/Documents/apartment/backend';
const controllerDir = path.join(baseDir, 'controllers');
const targetPath = path.join(controllerDir, '../config/convex');

console.log('Base Dir:', baseDir);
console.log('Controller Dir:', controllerDir);
console.log('Target Path:', targetPath);

if (fs.existsSync(targetPath + '.js')) {
    console.log('File exists at:', targetPath + '.js');
} else {
    console.log('File NOT found at:', targetPath + '.js');
    console.log('Contents of config dir:');
    try {
        console.log(fs.readdirSync(path.join(baseDir, 'config')));
    } catch (e) {
        console.log('Error reading config dir:', e.message);
    }
}

try {
    console.log('Resolved via require.resolve:', require.resolve(targetPath));
} catch (e) {
    console.log('require.resolve failed:', e.message);
}
