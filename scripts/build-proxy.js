import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { loadEnv } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Parse command line arguments for --mode
const args = process.argv.slice(2);
const modeIndex = args.indexOf('--mode');
let mode = process.env.NODE_ENV || 'production';

if (modeIndex !== -1 && args[modeIndex + 1]) {
  mode = args[modeIndex + 1];
}

console.log(`ℹ️  Running in mode: ${mode}`);
const env = loadEnv(mode, rootDir, '');

const proxyPath = path.join(rootDir, 'dist', 'proxy.php');
const apiBase = env.VITE_API_BASE_URL;

if (!apiBase) {
  console.warn('⚠️  Warning: VITE_API_BASE is not defined in .env file. Proxy might not work correctly.');
} else {
  console.log(`ℹ️  Injecting API Base URL: ${apiBase}`);
}

try {
  if (fs.existsSync(proxyPath)) {
    let content = fs.readFileSync(proxyPath, 'utf-8');

    // Replace the placeholder
    // We use a fallback if apiBase is missing to avoid breaking syntax
    const replacement = apiBase || 'http://localhost:5008';
    content = content.replace('__API_BASE_URL__', replacement);

    fs.writeFileSync(proxyPath, content);
    console.log('✅ Successfully injected API base URL into dist/proxy.php');
  } else {
    console.error('❌ Error: dist/proxy.php not found. Make sure to run this script after "vite build".');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error processing proxy.php:', error);
  process.exit(1);
}
