var path = require('path');

var juice;

module.exports = function () {
  var options = this.opts.pluginOptions.juice || {};

  var _debug = this.opts.bundleOptions.compileDebug;
  var _public = path.relative(this.opts.cwd, this.opts.public);

  this.opts.bundleOptions.postRender = function (params, done) {
    if (params.isTemplate && params.extension === 'html') {
      if (options.skip && params.source.indexOf(options.skip) > -1) {
        done();
        return;
      }

      if (options.only && params.source.indexOf(options.only) === -1) {
        done();
        return;
      }

      juice = juice || require('juice');

      juice.juiceResources(params.source, {
        removeStyleTags: !_debug,
        applyStyleTags: !_debug,
        webResources: {
          relativeTo: _public,
          scripts: typeof options.scripts === 'undefined' ? true : options.scripts,
          images: typeof options.images === 'undefined' ? true : options.images,
          links: typeof options.links === 'undefined' ? true : options.links,
          svgs: typeof options.svgs === 'undefined' ? true : options.svgs
        }
      }, function (err, html) {
        params.source = html;
        done(err);
      });
    } else {
      done();
    }
  };
};
