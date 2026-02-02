import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * FlexTranslator Version Synchronization Script
 * 
 * This script serves as the "Source of Truth" for the application's version number.
 * When run, it propagates the version defined in `NEW_VERSION` to all critical
 * configuration and documentation files, ensuring consistency across the monorepo.
 * 
 * Usage: node scripts/sync-version.js
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// ==========================================
// 1. DEFINE SOURCE OF TRUTH
// ==========================================
const NEW_VERSION = '1.4.0';

console.log(`📡 Syncing project to version: ${NEW_VERSION}`);

// ==========================================
// 2. UPDATE CONFIGURATION FILES
// ==========================================

// Task 2a: Update Frontend package.json
const packageJsonPath = path.join(rootDir, 'package.json');
if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    pkg.version = NEW_VERSION;
    // Write back with 2-space indentation and a trailing newline
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`✅ Updated package.json`);
}

// Task 2b: Update Backend (Functions) package.json
const functionsPkgPath = path.join(rootDir, 'functions', 'package.json');
if (fs.existsSync(functionsPkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(functionsPkgPath, 'utf-8'));
    pkg.version = NEW_VERSION;
    fs.writeFileSync(functionsPkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`✅ Updated functions/package.json`);
}

// ==========================================
// 3. UPDATE DOCUMENTATION
// ==========================================

const docFiles = [
    {
        // Updates the main README header
        // Regex is slightly permissive to handle potential future suffixes like -beta
        path: 'README.md',
        regex: /# FlexTranslator \(v.*?\)/,
        replacement: `# FlexTranslator (v${NEW_VERSION})`
    },
    {
        // Updates the Architecture Blueprint header
        path: 'BLUEPRINT.md',
        regex: /# FlexTranslator Blueprint \(v.*?\)/,
        replacement: `# FlexTranslator Blueprint (v${NEW_VERSION})`
    }
];

docFiles.forEach(file => {
    const filePath = path.join(rootDir, file.path);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf-8');
        // Debug check to verify what we are reading
        // console.log(`Checking ${file.path}...`); 
        if (file.regex.test(content)) {
            content = content.replace(file.regex, file.replacement);
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`✅ Updated ${file.path}`);
        } else {
            console.log(`⚠️  Version pattern not found in ${file.path}`);
            // Optional: Print header to debug if needed
            // console.log(`   Header found: ${content.split('\n')[0]}`);
        }
    } else {
        console.error(`❌ File not found: ${file.path}`);
    }
});

console.log('✨ Version sync complete.');
