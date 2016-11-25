import gulp from 'gulp';
import fs from 'fs';
import path from 'path';
import webpack from 'webpack-stream';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';

let coreModules;
const commonModules = [
  'inherits', 'util', 'events', 'lodash/core', 'readable-stream', 'multistream'
];
const apiModules = [
  'analytics', 'apex', 'bulk', 'chatter', 'metadata', 'soap', 'streaming', 'tooling'
];

const scriptTasks = [{
  name: 'build:scripts:all',
  entries: './index.js',
  standalone: 'jsforce',
  output: 'jsforce',
}, {
  name: 'build:scripts:core',
  entries: './core.js',
  standalone: 'jsforce',
  output: 'jsforce-core',
}]
.concat(
  apiModules.map((api) => ({
    name: `build:scripts:api:${api}`,
    entries: `./lib/api/${api}.js`,
    standalone: `jsforce.modules.api.${api[0].toUpperCase() + api.substring(1)}`,
    output: `jsforce-api-${api}`
  }))
);

scriptTasks.forEach(({ name, entries, standalone, transform = () => [], output }) => {
  gulp.task(name, () => {
    return gulp.src(entries)
      .pipe(webpack({
        output: {
            library: standalone,
            libraryTarget: "umd",
            filename: output + '.js',
        }
      }))
      .pipe(gulp.dest('./build'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(rename(output + '.min.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./build'))
    ;
  });
});

gulp.task('build:required', (cb) => {
  fs.readdir('./lib', function(err, files) {
    if (err) { return cb(err); }
    coreModules =
      files.filter((f) => /\.js$/.test(f) && !/^(jsforce|require|_required)\.js$/.test(f))
           .map((f) => './' + f.replace(/\.js$/, ''));
    var requireFile = './lib/_required.js';
    var code = [
      '// This file content is dynamically created in build script',
      '"use strict";',
      'module.exports = {',
      commonModules.concat(coreModules)
        .map((module) => `  '${module}': require('${module}')`)
        .join(',\n'),
      '};'
    ].join('\n');
    fs.writeFileSync(requireFile, code, 'utf8');
    cb();
  });
});

gulp.task('build:scripts', gulp.parallel(...scriptTasks.map(({ name }) => name)));
gulp.task('build', gulp.series('build:required', 'build:scripts'));


const testScripts =
  fs.readdirSync('./test')
    .filter((filename) => /\.test\.js$/.test(filename))
    .map((filename) => path.join('./test', filename));

gulp.task('build:test', () => {
  return gulp.src(testScripts)
    .pipe(webpack({
      node: {
       fs: "empty",
       tls: "empty",
       net: "empty",
       child_process: "empty"
      },
      output: {
          library: 'test',
          libraryTarget: "umd",
          filename: 'test.js',
      },
      module: {
          preLoaders: [
              { test: /\.json$/, loader: 'json'},
          ],
          loaders: [
              { test: /\.ejs$/, loader: 'raw' },
              { test: /_test\.js$/, loader: "webpack-espower-loader" }
          ]
      }
    }))
    .pipe(gulp.dest('./build'))
  ;

  return browserify({
    entries: testScripts,
    debug: true,
    transform: [
      'espowerify',
      'envify',
      [ 'require-swapper',
        {
          baseDir: './lib/',
          fn: 'window.jsforce.require',
          modules: ['./*'],
        }
      ]
    ],
  }).bundle()
    .pipe(source('./test.js'))
    .pipe(gulp.dest('./build'));
});


gulp.task('build:all', gulp.parallel('build', 'build:test'));

gulp.task('default', gulp.series('build'));
