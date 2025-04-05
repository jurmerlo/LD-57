import { cpSync, createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { spawnSync } from 'child_process';
import archiver from 'archiver';
import { Command } from 'commander';
import path from 'path';
import luamin from 'luamin';
import { rimrafSync } from 'rimraf';

import * as tstl from 'typescript-to-lua';
import * as ts from 'typescript';

/**
 * Create a .love file from a folder.
 * @param {{name?: string }} options
 */
function packLove(options) {
  let destination = options.name ? options.name : 'game';
  if (!destination.endsWith('.love')) {
    destination += '.love';
  }

  const outPath = path.join(process.cwd(), destination);
  const output = createWriteStream(outPath);

  const source = options.project ? options.project : 'export';

  const archive = archiver('zip');
  archive.pipe(output);

  archive.directory(source, false);
  archive.finalize();
}

/**
 * Build the project.
 * @param {{ clean?: boolean, bundle?: boolean, minify?: boolean }} options
 * @return {boolean} success
 */
function buildProject(options) {
  if (options.clean) {
    rimrafSync(path.join(process.cwd(), 'export'));
  }

  if (!existsSync(path.join(process.cwd(), 'export'))) {
    mkdirSync(path.join(process.cwd(), 'export'));
  }

  process.stdout.write('\nCopying assets...\n');
  if (existsSync(path.join(process.cwd(), 'assets'))) {
    cpSync(path.join(process.cwd(), 'assets'), path.join(process.cwd(), 'export/assets'), { recursive: true });
  }

  process.stdout.write('\nCompiling TypeScript to Lua...\n');
  const project = 'tsconfig.json';

  let result;
  if (options.minify) {
    result = tstl.transpileProject(path.join(process.cwd(), project), {
      luaBundle: 'main.lua',
      luaBundleEntry: 'src/main.ts',
      noEmitOnError: true,
    });

    const mainLua = path.join(process.cwd(), 'export/main.lua');
    const data = readFileSync(mainLua, 'utf8');
    // @ts-ignore
    const minified = luamin.minify(data);
    writeFileSync(mainLua, minified);
  } else {
    result = tstl.transpileProject(path.join(process.cwd(), project), { noEmitOnError: true });
  }

  const reportDiagnostic = tstl.createDiagnosticReporter(true);
  const diagnostics = ts.sortAndDeduplicateDiagnostics(result.diagnostics);
  diagnostics.forEach(reportDiagnostic);

  const success = result.diagnostics.length === 0;
  if (success) {
    process.stdout.write('Build complete.\n');
  } else {
    process.stdout.write('Build failed.\n');
  }

  return success;
}

/**
 * Build the project and start it.
 * @param {Object} options
 */
function buildAndRun(options) {
  if (buildProject(options)) {
    spawnSync('love', ['export'], { stdio: 'inherit' });
    process.stdout.write('Finished running love.\n');
  }
}

const program = new Command();

program.name('Love Helper').description('Love2d Helper tools').version('0.0.1');

program
  .command('.love')
  .description('Create a .love file from a folder')
  .option('-n --name <string>', 'The name of the .love file')
  .action(packLove);

program
  .command('build')
  .description('Build the project')
  .option('-c, --clean', 'Clean the export directory')
  .option('--minify', 'Minify the lua code for smaller file size')
  .action((options) => {
    buildProject(options);
  });

program
  .command('run')
  .description('Build and run the project.')
  .option('-c, --clean', 'Clean the export directory.')
  .option('--minify', 'Minify the lua code for smaller file size')
  .action(buildAndRun);

program.parse();
