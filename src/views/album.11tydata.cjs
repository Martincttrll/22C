module.exports = {
  eleventyComputed: {
    permalink: function (data) {
      console.log(data.album.slug);
      return `discography/${data.album.slug}/`;
    },
  },
};
