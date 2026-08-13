/**
 * Precompute DocCard covers/descriptions during start/build.
 * The client only reads this JSON — it must not import target docs or live previews.
 * Cover images land in static/img/doc-gallery/ (gitignored).
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
