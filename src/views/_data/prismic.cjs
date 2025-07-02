require("dotenv").config();
const prismic = require("@prismicio/client");

const PRISMIC_REPO = process.env.PRISMIC_REPOSITORY;
const client = prismic.createClient(PRISMIC_REPO);

async function fetchHomepage() {
  const homepage = await client.getSingle("homepage");

  const newsIds = homepage.data.news_list
    .map((item) => item.news_item?.id)
    .filter(Boolean);

  const newsDocuments =
    newsIds.length > 0 ? await client.getAllByIDs(newsIds) : [];

  homepage.data.news_list = homepage.data.news_list.map((item) => {
    const fullNews = newsDocuments.find(
      (news) => news.id === item.news_item?.id
    );
    return {
      ...item,
      news_item: fullNews || item.news_item,
    };
  });

  return { homepage };
}

function extractImagesFromData(data) {
  const urls = [];

  function scan(obj) {
    if (!obj) return;

    if (Array.isArray(obj)) {
      obj.forEach(scan);
    } else if (typeof obj === "object") {
      for (const key in obj) {
        const value = obj[key];
        if (
          value &&
          typeof value === "object" &&
          value.url &&
          value.dimensions
        ) {
          urls.push(value.url);
        } else {
          scan(value);
        }
      }
    }
  }

  scan(data);
  return urls;
}

async function fetchPrismicData() {
  const { homepage } = await fetchHomepage();

  const assets = extractImagesFromData(homepage.data);

  return {
    homepage,
    assets,
  };
}

module.exports = fetchPrismicData;
