var path = require('path');

var juice;

function makeJuice(options) {
  return function (params, done) {
    if (params.dest.indexOf('.html') > -1) {
      if (options.skip && params.output.indexOf(options.skip) > -1) {
        done();
        return;
      }

      if (options.only && params.output.indexOf(options.only) === -1) {
        done();
        return;
      }

      juice = juice || require('juice');

      juice.juiceResources(params.output, {
        removeStyleTags: !options.debug,
        applyStyleTags: !options.debug,
        webResources: {
          relativeTo: options.cwd,
          scripts: typeof options.scripts === 'undefined' ? true : options.scripts,
          images: typeof options.images === 'undefined' ? true : options.images,
          links: typeof options.links === 'undefined' ? true : options.links,
          svgs: typeof options.svgs === 'undefined' ? true : options.svgs
        }
      }, function (err, html) {
        params.output = html;
        done(err);
      });
    } else {
      done();
    }
  };
}

module.exports = function () {
  var options = this.util.extend({}, this.opts.pluginOptions.juice || {});

  options.debug = this.opts.bundleOptions.compileDebug;
  options.cwd = path.relative(this.opts.cwd, this.opts.public);

  var compiler = makeJuice(options);

  this.on('write', function (view) {
    return new Promise(function (resolve, reject) {
      compiler(view, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};
