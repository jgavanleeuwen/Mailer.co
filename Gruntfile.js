module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    // Task: Lint all JS files
    jshint: {
      files: ['js/application/**/*.js', 'app/**/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: false,
          module: true
        }
      }
    },

    // Task: Compile SASS to CSS
    less: {
      compile: {
        files: {
          'public/styles/style.css': 'public/styles/style.less'
        }
      }
    },

    // Task: Uglify build JS
    requirejs: {
      production: {
        options: {
          name: 'app',
          baseUrl: "public/js/application",
          mainConfigFile: "public/js/application/bootstrap.js",
          out: "public/js/build/build.js"
        }
      }
    },

    // Task: Restart NodeJS
    shell: {
      nodemon: {
        command: 'lcm server',
        options: {
          stdout: true,
          stderr: true
        }
      }
    },

    // Watch
    watch: {
      jshint: {
        files: ['js/**/*.js', 'Gruntfile.js', 'app/**/*.js'],
        tasks: ['jshint']
      },
      sass: {
        files: ['public/styles/**/*.less'],
        tasks: ['less']
      }
    }

  });

  // Load the plugin for watch
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Load the plugin for JSHint
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Load the plugin for LESS
  grunt.loadNpmTasks('grunt-contrib-less');

   // Load the plugin for RequireJS
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Load the plugin for develop
  grunt.loadNpmTasks('grunt-shell');

  // Default task(s).
  grunt.registerTask('default', ['jshint']);

};