var path = require('path');

var juice;

function makeJuice(options) {
  return function (params, done) {
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
        removeStyleTags: !options.debug && options.styles !== false,
        applyStyleTags: !options.debug && options.styles !== false,
        webResources: {
          relativeTo: options.cwd,
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
}

module.exports = function () {
  var options = this.util.extend({}, this.opts.pluginOptions['tarima-juice']
    || this.opts.pluginOptions.juice || {});

  options.debug = this.opts.bundleOptions.compileDebug;
  options.cwd = path.relative(this.opts.cwd, this.opts.public);

  this.opts.bundleOptions.postRender = this.opts.bundleOptions.postRender || [];
  this.opts.bundleOptions.postRender.push(makeJuice(options));
};
