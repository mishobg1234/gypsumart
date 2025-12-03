const fs = require('fs');
const path = require('path');

const replacements = [
  // Background colors
  { from: /bg-amber-600/g, to: 'bg-brand-orange' },
  { from: /bg-amber-700/g, to: 'bg-brand-orange/90' },
  { from: /bg-amber-500/g, to: 'bg-brand-orange' },
  { from: /bg-amber-50/g, to: 'bg-brand-green-light/10' },
  { from: /bg-amber-100/g, to: 'bg-brand-green-light/20' },
  
  // Text colors
  { from: /text-amber-600/g, to: 'text-brand-green-light' },
  { from: /text-amber-700/g, to: 'text-brand-green' },
  { from: /text-amber-800/g, to: 'text-brand-green' },
  { from: /text-amber-500/g, to: 'text-brand-green-light' },
  
  // Hover states
  { from: /hover:bg-amber-700/g, to: 'hover:bg-brand-orange/90' },
  { from: /hover:bg-amber-600/g, to: 'hover:bg-brand-orange' },
  { from: /hover:bg-amber-50/g, to: 'hover:bg-brand-green-light/10' },
  { from: /hover:text-amber-600/g, to: 'hover:text-brand-green-light' },
  { from: /hover:text-amber-700/g, to: 'hover:text-brand-green' },
  
  // Rings and borders
  { from: /ring-amber-500/g, to: 'ring-brand-green-light' },
  { from: /focus:ring-amber-500/g, to: 'focus:ring-brand-green-light' },
  { from: /border-amber-300/g, to: 'border-brand-green-light/30' },
  { from: /border-amber-200/g, to: 'border-brand-green-light/20' },
  { from: /border-amber-500/g, to: 'border-brand-green-light' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  replacements.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      processFile(filePath);
    }
  });
}

console.log('🎨 Replacing amber colors with ArtBuild brand colors...\n');
walkDir('./src');
console.log('\n✅ Color replacement complete!');
