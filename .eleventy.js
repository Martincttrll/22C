import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";
import pugPlugin from "@11ty/eleventy-plugin-pug";
import dotenv from "dotenv";

dotenv.config();

export default function (eleventyConfig) {
  eleventyConfig.setServerOptions({
    showAllHosts: true,
  });

  eleventyConfig.addPlugin(EleventyVitePlugin, {
    tempFolderName: ".11ty-vite",

    viteOptions: {
      publicDir: "public",
      root: "src",
      base: "/src/app/",
    },
  });
  eleventyConfig.addPlugin(pugPlugin, {
    debug: true,
  });

  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addPassthroughCopy("src/app");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("albums.json");
  eleventyConfig.addPassthroughCopy(".htaccess");
  eleventyConfig.setServerPassthroughCopyBehavior("copy");

  return {
    dir: {
      input: "src/views",
      output: "_site",
      includes: "_includes",
      data: "_data",
      layouts: "_layouts",
    },
  };
}
