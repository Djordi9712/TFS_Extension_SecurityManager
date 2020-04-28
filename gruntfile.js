/*The extension can automatically be build, created and published by running a grunt task (run 'grunt' in the terminal)*/
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        settings: grunt.file.readJSON("settings.tfx.json"),
        exec: {
            update: {
                command: "npm run build",
                stdout: true,
                stderr: true
            },
            package: {
                command: "tfx extension create --rev-version",
                stdout: true,
                stderr: true
            },
            publish_ext: {
                command: "tfx extension publish --token <%= settings.publish.token %> --auth-type pat --service-url <%= settings.serviceUrl %>",
                stdout: true,
                stderr: true
            }
        }
    });
    grunt.loadNpmTasks('grunt-exec');
    grunt.registerTask('default', ['exec']);
};