import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * FlexTranslator Build Integrity Checker
 * 
 * Sequentially validates TypeScript integrity for Frontend and Backend.
 * 
 * Usage Modes:
 * 1. Default (Run All):
 *    $ node scripts/check_tslint.js
 * 
 * 2. Frontend Only (Phase 1):
 *    $ node scripts/check_tslint.js --phase1
 * 
 * 3. Backend Only (Phase 2):
 *    $ node scripts/check_tslint.js --phase2
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const TIMEOUT_MS = 200000; // 200 seconds

// Check for command line arguments
const args = process.argv.slice(2);
const runPhase1 = args.includes('--phase1') || args.length === 0;
const runPhase2 = args.includes('--phase2') || args.length === 0;

function runCommand(command, cwd, description) {
    return new Promise((resolve) => {
        console.log(`
⏳ Running ${description}...`);
        
        const child = exec(command, { 
            cwd,
            timeout: TIMEOUT_MS,
            env: { ...process.env } 
        }, (error, stdout, stderr) => {
            if (error) {
                if (error.killed) {
                    console.log(`❌ ${description}: Timed out after ${TIMEOUT_MS/1000}s`);
                } else {
                    console.log(`❌ ${description}: Failed`);
                    const output = (stdout + stderr).trim();
                    if (output) {
                        console.log(`
   Error details:
${output.substring(0, 2000)}${output.length > 2000 ? '\n... (truncated)' : ''}`);
                    } else {
                        console.log(`   Error code: ${error.code}`);
                    }
                } 
            } else {
                console.log(`✅ ${description}: Result: Passed (No errors found)`);
            }
            resolve();
        });
    });
}

async function execute() {
    console.log('🚀 Starting Build Integrity Checks...');

    // ==========================================
    // PHASE 1: FRONTEND CHECK
    // ==========================================
    if (runPhase1) {
        await runCommand(
            'npx tsc -b',
            rootDir,
            "Phase 1a: Frontend Build Graph (tsc -b)"
        );
        await runCommand(
            'npx tsc --noEmit',
            rootDir,
            "Phase 1b: Frontend Codebase Sanity (tsc --noEmit)"
        );
        await runCommand(
            'npm run lint',
            rootDir,
            "Phase 1c: Frontend Lint (Unused Imports)"
        );
    } else {
        console.log('ℹ️  Skipping Phase 1 (Frontend)');
    }

    // ==========================================
    // PHASE 2: BACKEND CHECK
    // ==========================================
    if (runPhase2) {
        // Backend often requires more heap space for TypeScript compilation
        await runCommand(
            'NODE_OPTIONS="--max-old-space-size=4096" npx tsc -b',
            path.join(rootDir, 'functions'),
            "Phase 2a: Backend Build Graph (tsc -b)"
        );
        await runCommand(
            'NODE_OPTIONS="--max-old-space-size=4096" npx tsc --noEmit',
            path.join(rootDir, 'functions'),
            "Phase 2b: Backend Codebase Sanity (tsc --noEmit)"
        );
        // Check if functions has a lint script before running
        await runCommand(
            'npm run lint',
            path.join(rootDir, 'functions'),
            "Phase 2c: Backend Lint (Unused Imports)"
        );
    } else {
        console.log('ℹ️  Skipping Phase 2 (Backend)');
    }

    console.log('\n✨ Execution complete.');
}

execute();