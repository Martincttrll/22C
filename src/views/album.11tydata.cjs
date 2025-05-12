module.exports = {
  eleventyComputed: {
    permalink: function (data) {
      return `discography/${data.album.slug}/`;
    },
  },
};
