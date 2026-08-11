module.exports = function docGalleryPlugin() {
  return {
    name: "doc-gallery",
    async loadContent() {
      const {buildDocGallery} = await import("../tools/doc-gallery/build.mjs");
      buildDocGallery();
    },
  };
};
