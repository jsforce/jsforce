import gulp from 'gulp';
import fs from 'fs';
import path from 'path';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';

let coreModules;
const commonModules = [
  'inherits', 'util', 'events', 'lodash/core', 'readable-stream'
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
    output: `jsforce-api-${api}`,
    transform: () => {
      const swappingModules = commonModules.concat(coreModules);
      return [
        [ 'require-swapper',
          {
            baseDir: './lib/',
            fn: 'window.jsforce.require',
            modules: swappingModules,
          }
        ]
      ]
    }
  }))
);

scriptTasks.forEach(({ name, entries, standalone, transform = () => [], output }) => {
  gulp.task(name, () => {
    return browserify({
      entries,
      standalone,
      transform: transform(),
      debug: true,
    }).bundle()
      .pipe(source(output + '.js'))
      .pipe(gulp.dest('./build'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(rename(output + '.min.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./build'));
  });
});

gulp.task('build:required', (cb) => {
  fs.readdir('./lib', function(err, files) {
    if (err) { return cb(err); }
    coreModules =
      files.filter((f) => /\.js$/.test(f) && !/^(jsforce|require)\.js$/.test(f))
           .map((f) => './' + f.replace(/\.js$/, ''));
    var requireFile = './lib/require.js';
    var code = fs.readFileSync(requireFile, 'utf8');
    code = code.replace(/START_REQUIRE([\s\S]+)END_REQUIRE/m, function($0, $1) {
      return [
        'START_REQUIRE',
        ...commonModules.concat(coreModules).map((module) => `require('${module}');`),
        '// END_REQUIRE',
      ].join('\n');
    });
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
