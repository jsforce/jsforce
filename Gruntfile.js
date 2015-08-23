/*global process */
var fs = require('fs');
var envfile = require('envfile');

module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json');
  if (pkg.devDependencies) {
    Object.keys(pkg.devDependencies).filter(function(pkgname) {
      if (pkgname.indexOf('grunt-') === 0) {
        grunt.loadNpmTasks(pkgname);
      }
    });
  }

  var cfg = {

    pkg: pkg,

    dirs: {
      src: './lib',
      build: './build',
      tmp: './build/__tmp__',
      tmpLib: './build/__tmp__/lib',
      test: './test',
      buildTest: './build/test',
      doc: './doc'
    },

    watch: {
      scripts: {
        files: [ '<%= dirs.src %>/**/*.js' ],
        tasks: [ 'build' ]
      },
      jsdoc: {
        files: [ '<%= dirs.src %>/**/*.js' ],
        tasks: [ 'jsdoc' ]
      }
    },

    copy: {
      lib: {
        files: [{
          expand: true,
          cwd: '<%= dirs.src %>',
          src: '**/*.js',
          dest: '<%= dirs.tmpLib %>'
        }]
      },
      package: {
        files: {
          '<%= dirs.tmp %>/package.json': [ './package.json' ]
        }
      }
    },

    extract_required: {
      core: {
        files: {
          '<%= dirs.tmpLib %>/core-require.js': [ '<%= dirs.tmpLib %>/*.js' ]
        },
        options: {
          ignore: [ './api/**/*' ]
        }
      }
    },

    browserify: {
      options: {
        ignore: [
          '<%= dirs.src %>/**/cli/*.js',
          '<%= dirs.test %>/**/node/*.js'
        ]
      },
      all: {
        files: {
          '<%= dirs.build %>/jsforce.js': [ '<%= dirs.tmpLib %>/browser/jsforce.js' ]
        },
        options: {
          browserifyOptions: {
            standalone: 'jsforce'
          }
        }
      },
      core: {
        files: {
          '<%= dirs.build %>/jsforce-core.js': [ '<%= dirs.tmpLib %>/browser/jsforce.js' ]
        },
        options: {
          browserifyOptions: {
            standalone: 'jsforce'
          },
          transform: [
            [ 'require-swapper',
              {
                baseDir: '<%= dirs.tmpLib %>',
                fn: "jsforce.require",
                modules: [ "./lib/api/**/*" ]
              }
            ]
          ]
        }
      },
      test: {
        files: [
          {
            expand: true,
            cwd: '<%= dirs.test %>',
            src: [ '**/*.test.js' ],
            dest: '<%= dirs.buildTest %>'
          }
        ],
        options: {
          debug: true,
          transform: [
            'espowerify',
            'envify',
            [ 'require-swapper',
              {
                baseDir: '<%= dirs.src %>',
                fn: "jsforce.require",
                modules: [ "./*" ]
              }
            ]
          ]
        }
      }
    },

    "string-replace": {
      lib: {
        files: [{
          expand: true,
          cwd: '<%= dirs.build %>',
          src: [ 'jsforce.js', 'jsforce*[!.min].js' ],
          dest: '<%= dirs.build %>'
        }],
        options: {
          replacements: [{
            pattern: new RegExp(__dirname, 'g'),
            replacement: '.'
          }]
        }
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        sourceMapIncludeSources: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      lib: {
        files: [{
          expand: true,
          cwd: '<%= dirs.build %>',
          src: [ 'jsforce*.js', '!jsforce*.min.js' ],
          dest: '<%= dirs.build %>',
          ext: '.min.js'
        }]
      }
    },

    jsdoc : {
      dist : {
        src: ['<%= dirs.src %>'],
        options: {
          destination: '<%= dirs.doc %>',
          private: false,
          recurse: true,
          lenient: true
        }
      }
    },

    clean: {
      tmp: {
        src: [ '<%= dirs.tmp %>' ]
      },
      lib: {
        src: [ '<%= dirs.build %>/*.js', '<%= dirs.build %>/*.map' ]
      },
      test: {
        src: [ '<%= dirs.buildTest %>' ]
      },
      doc: {
        src: [ '<%= dirs.doc %>' ]
      }
    }
  };

  var coreModules = [
    "cache", "connection", "csv", "date", "http-api", "jsforce", "logger", "oauth2", "process", "promise", "query", "quick-action",
    "record-stream", "record", "sobject", "soql-builder", "transport"
  ];
  var apiModules = [ "analytics", "apex", "bulk", "chatter", "metadata", "soap", "streaming", "tooling" ];

  apiModules.forEach(function(apiModule) {
    var apiModuleClass = apiModule[0].toUpperCase() + apiModule.substring(1);
    cfg.browserify[apiModule] = {
      files: [{
        src: [ '<%= dirs.tmpLib %>/api/' + apiModule + '.js' ],
        dest: '<%= dirs.build %>/jsforce-api-' + apiModule + '.js'
      }],
      options: {
        browserifyOptions: {
          standalone: 'jsforce.modules.api.' + apiModuleClass
        },
        transform: [
          [ 'require-swapper', {
            baseDir: '<%= dirs.tmpLib %>',
            fn: "jsforce.require",
            modules: coreModules.map(function(m) { return "./" + m; }).concat([ "inherits", "util", "events", "underscore", "readable-stream" ])
          }]
        ]
      }
    };
  });

  grunt.initConfig(cfg);

  grunt.registerTask('browserify:lib', [ 'browserify:all', 'browserify:core' ].concat(apiModules.map(function(am){ return 'browserify:'+am; })));
  grunt.registerTask('build', [ 'clean:tmp', 'copy', 'extract_required', 'browserify:lib', 'string-replace', 'uglify']);
  grunt.registerTask('test:browser', ['clean', 'copy', 'extract_required', 'browserify' ]);
  grunt.registerTask('default', ['build']);

};
