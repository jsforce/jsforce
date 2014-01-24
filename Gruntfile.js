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

  grunt.initConfig({

    pkg: pkg,

    browserify: {
      options: {
        ignore: [
          "request",
          "lib/**/node/*.js",
          "test/**/node/*.js"
        ]
      },
      lib: {
        files: {
          'build/lib/salesforce.js': [ 'lib/salesforce.js' ]
        },
        options: {
          standalone: 'SF'
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

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      dist: {
        files: {
          'build/lib/salesforce.min.js': ['build/lib/salesforce.js']
        }
      }
    },

    jsdoc : {
      dist : {
        src: ['lib/'],
        options: {
          destination: 'doc',
          template: 'template',
          configure: 'template/jsdoc.conf.json',
          private: false,
          recurse: true,
          lenient: true
        }
      }
    },

    clean: {
      lib: {
        src: [ "build/lib/salesforce.js" ]
      },
      test: {
        src: [ "build/test/**.test.js" ]
      },
      doc: {
        src: [ "doc/" ]
      }
    }

  });

  grunt.registerTask('build', ['browserify', 'uglify']);
  grunt.registerTask('default', ['build']);

};
