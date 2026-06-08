const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.json')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = [...walk('app'), ...walk('data')];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const regex = /dual[- ]?inspector/gi;
    if (regex.test(content)) {
        content = content.replace(regex, (match) => {
            if (match[0] === match[0].toUpperCase()) {
                return "Two Person Inspection Team";
            }
            return "two person inspection team";
        });
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated: ' + file);
    }
});
