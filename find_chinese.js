// Find all Chinese strings that appear in JSX/TSX (not comments)
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const results = [];

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const full = path.join(dir, f);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) walkDir(full);
        else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
            const content = fs.readFileSync(full, 'utf8');
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                // Skip pure comment lines
                const trimmed = line.trim();
                if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;
                // Check for Chinese characters
                const match = line.match(/[\u4e00-\u9fff]+[^}]*/g);
                if (match) {
                    // Check if it's in a string literal (quotes), JSX text, or template literal
                    const inString = /['"`]([^'"`]*[\u4e00-\u9fff]+[^'"`]*)['"`]/g;
                    const inJSX = />([^<]*[\u4e00-\u9fff]+[^<]*)</g;
                    let found = false;
                    let m;
                    while ((m = inString.exec(line)) !== null) {
                        const rel = path.relative(srcDir, full);
                        results.push({ file: rel, line: i + 1, text: m[1].trim().substring(0, 80) });
                        found = true;
                    }
                    while ((m = inJSX.exec(line)) !== null) {
                        const rel = path.relative(srcDir, full);
                        results.push({ file: rel, line: i + 1, text: m[1].trim().substring(0, 80) });
                        found = true;
                    }
                }
            }
        }
    }
}

walkDir(srcDir);

// Group by file
const byFile = {};
for (const r of results) {
    if (!byFile[r.file]) byFile[r.file] = [];
    byFile[r.file].push(r);
}

console.log(`Found ${results.length} Chinese strings in ${Object.keys(byFile).length} files:\n`);
for (const [file, items] of Object.entries(byFile)) {
    console.log(`--- ${file} (${items.length} strings) ---`);
    for (const item of items) {
        console.log(`  L${item.line}: ${item.text}`);
    }
    console.log();
}
