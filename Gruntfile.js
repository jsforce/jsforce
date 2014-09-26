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

    watch: {
      scripts: {
        files: ["lib/**/*.js" ],
        tasks: ['build']
      },
      jsdoc: {
        files: ["lib/**/*.js" ],
        tasks: ['jsdoc']
      }
    },

    copy: {
      lib: {
        files: [{
          expand: true,
          cwd: 'lib/',
          src: '**/*.js',
          dest: 'build/__tmp__'
        }]
      }
    },

    extract_required: {
      core: {
        files: {
          'build/__tmp__/core-require.js': [ 'build/__tmp__/*.js' ]
        },
        options: {
          ignore: [ './api/**/*' ]
        }
      }
    },

    browserify: {
      options: {
        ignore: [
          "request",
          "lib/**/cli/*.js",
          "test/**/node/*.js"
        ]
      },
      all: {
        files: {
          'build/jsforce.js': [ 'build/__tmp__/browser/jsforce.js' ]
        },
        options: {
          browserifyOptions: {
            standalone: 'jsforce'
          }
        }
      },
      core: {
        files: {
          'build/jsforce-core.js': [ 'build/__tmp__/browser/jsforce.js' ]
        },
        options: {
          browserifyOptions: {
            standalone: 'jsforce'
          },
          transform: [
            [ 'require-swapper',
              {
                baseDir: 'build/__tmp__',
                fn: "jsforce.require",
                modules: [ "./api/**/*" ]
              }
            ]
          ]
        }
      },
      test: {
        files: [
          {
            expand: true,
            cwd: 'test/',
            src: [ '**/*.test.js' ],
            dest: 'build/test/'
          }
        ],
        options: {
          debug: true,
          transform: [ 'espowerify', 
            [ 'require-swapper',
              {
                baseDir: 'lib/',
                fn: "jsforce.require",
                modules: [ "./*" ]
              }
            ]
          ],
          preBundleCB: function(b) {
            var filePath = "./test/config/browser/env.js";
            var env = process.env;
            try {
              env = envfile.parseFileSync('./.env');
            } catch(e) {}
            var data = "module.exports=" + JSON.stringify(env) + ";";
            fs.writeFileSync(filePath, data);
          }
        }
      }
    },

    "string-replace": {
      lib: {
        files: {
          'build/' : [ 'build/jsforce.js', 'build/jsforce*[!.min].js' ]
        },
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
          cwd: 'build/',
          src: [ 'jsforce*.js', '!jsforce*.min.js' ],
          dest: 'build/',
          ext: '.min.js'
        }]
      }
    },

    jsdoc : {
      dist : {
        src: ['lib/'],
        options: {
          destination: 'doc',
          private: false,
          recurse: true,
          lenient: true
        }
      }
    },

    clean: {
      tmp: {
        src: [ "build/__tmp__/" ]
      },
      lib: {
        src: [ "build/*.js", "build/*.map" ]
      },
      test: {
        src: [ "build/test/" ]
      },
      doc: {
        src: [ "doc/" ]
      }
    }
  };

  var apiModules = [ "analytics", "apex", "bulk", "chatter", "metadata", "streaming", "tooling" ];
  apiModules.forEach(function(apiModule) {
    var apiModuleClass = apiModule[0].toUpperCase() + apiModule.substring(1);
    cfg.browserify[apiModule] = {
      files: [{
        src: [ 'build/__tmp__/api/' + apiModule + '.js' ],
        dest: 'build/jsforce-api-' + apiModule + '.js'
      }],
      options: {
        browserifyOptions: {
          standalone: 'jsforce.modules.api.' + apiModuleClass
        },
        transform: [
          [ 'require-swapper', {
            baseDir: '__tmp__',
            fn: "jsforce.require",
            modules: [ "./*", "util", "events", "stream", "underscore" ]
          }]
        ]
      }
    };
  });

  grunt.initConfig(cfg);

  grunt.registerTask('browserify:lib', [ 'browserify:all', 'browserify:core' ].concat(apiModules.map(function(am){ return 'browserify:'+am; })));
  grunt.registerTask('build', ['clean:tmp', 'copy', 'extract_required', 'browserify:lib', 'string-replace', 'uglify']);
  grunt.registerTask('test:browser', ['clean', 'copy', 'extract_required', 'browserify' ]);
  grunt.registerTask('default', ['build']);

};
