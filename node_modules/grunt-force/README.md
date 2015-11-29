# grunt-force

> The stupid force-flag toggler.

## Getting Started

This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-force --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-force');
```

## Tasks

### `force:on`

Sets the `force` option to `true`.

### `force:off`

Sets the `force` option to `false`.

### `force` or `force:reset`

Sets the `force` option back to its original value. Defaults to `false`, but would be `true` if Grunt was executed with the `--force` flag.

## Example

```js
grunt.registerTask('default', [
    'force:on',
    'csslint',
    'jshint',
    'force:off',
    'testTask',
    'force:reset',
    'buildTask'
]);
```

## Contributing

Make sure you've installed [Node.js](http://nodejs.org), which ships with [npm](http://npmjs.org).

```sh
# Install Grunt globally
$ npm install -g grunt-cli

# Clone the repository
$ git clone git://github.com/shannonmoeller/grunt-force
$ cd grunt-force
```

## License

MIT
