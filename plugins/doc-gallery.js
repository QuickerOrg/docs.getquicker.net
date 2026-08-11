/**
 * Build DocCard gallery data during start/build and inject it via globalData.
 * Cover images land in static/img/doc-gallery/ (gitignored). No generated JSON in src/.
 */
module.exports = function docGalleryPlugin(context) {
  return {
    name: "doc-gallery",
    getPathsToWatch() {
      return [`${context.siteDir}/docs/**/*.{md,mdx,json}`];
    },
    async loadContent() {
      const {buildDocGallery} = await import("../tools/doc-gallery/build.mjs");
      return buildDocGallery();
    },
    async contentLoaded({content, actions}) {
      actions.setGlobalData({gallery: content.gallery});
    },
  };
};
