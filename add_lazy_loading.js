import fs from 'fs';
import path from 'path';

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.vue')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We look for <img ... >
      // Negative lookbehind or just simple regex replace
      // Make sure we only add it if loading="lazy" is not there
      const result = content.replace(/<img\b(?![^>]*?loading=)([^>]+?)>/g, '<img loading="lazy"$1>');
      
      if (result !== content) {
        fs.writeFileSync(fullPath, result, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

const appPath = path.join(process.cwd(), 'app');
processDirectory(appPath);
