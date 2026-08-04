const fs = require('fs');
const path = require('path');
const root = path.join(process.cwd(), 'src');

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      let text = fs.readFileSync(full, 'utf8');
      const original = text;
      text = text.replace(/rounded-\[32px\]/g, 'rounded-4xl');
      text = text.replace(/rounded-\[24px\]/g, 'rounded-3xl');
      text = text.replace(/rounded-\[28px\]/g, 'rounded-3xl');
      text = text.replace(/bg-gradient-to-r/g, 'bg-linear-to-r');
      text = text.replace(/bg-gradient-to-br/g, 'bg-linear-to-br');
      text = text.replace(/bg-gradient-to-t/g, 'bg-linear-to-t');
      text = text.replace(/bg-\[radial-gradient\(circle_at_top_left,_rgba\(34,211,238,0\.16\),_transparent_28%\),linear-gradient\(135deg,_#050816_0%,_#111827_100%\)\]/g, 'bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),linear-gradient(135deg,#050816_0%,#111827_100%)]');
      text = text.replace(/bg-\[radial-gradient\(circle_at_top_left,_rgba\(255,255,255,0\.08\),_transparent_30%\),linear-gradient\(135deg,_#06070b_0%,_#0f1424_100%\)\]/g, 'bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_30%),linear-gradient(135deg,#06070b_0%,#0f1424_100%)]');
      if (text !== original) {
        fs.writeFileSync(full, text);
      }
    }
  }
}

walk(root);
