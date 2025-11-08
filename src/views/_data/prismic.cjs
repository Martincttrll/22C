require("dotenv").config();
const prismic = require("@prismicio/client");

const PRISMIC_REPO = process.env.PRISMIC_REPOSITORY;
const client = prismic.createClient(PRISMIC_REPO);

async function fetchAlbums() {
  const response = await client.getByType("music_files");

  const albums = {};

  response.results.forEach((doc) => {
    const albumTitle = doc.data.album_title.toLowerCase();

    if (!albums[albumTitle]) {
      albums[albumTitle] = [];
    }

    doc.data.album_items.forEach((item) => {
      if (item.mp3_file?.url) {
        albums[albumTitle].push({
          item_title: item.item_title,
          mp3_url: item.mp3_file.url,
        });
      }
    });
  });

  return albums;
}

async function fetchHomepage() {
  const homepage = await client.getSingle("homepage");

  homepage.data.news_list = await fetchLinkedDocuments(
    homepage.data.news_list,
    "news_item"
  );
  homepage.data.reels_list = await fetchLinkedDocuments(
    homepage.data.reels_list,
    "reels_item"
  );

  return { homepage };
}
async function fetchContactPage() {
  const contactpage = await client.getSingle("contact_page");
  return { contactpage };
}

async function fetchLinkedDocuments(list, key) {
  const ids = list.map((item) => item[key]?.id).filter(Boolean);
  if (ids.length === 0) return [];

  const documents = await client.getAllByIDs(ids);

  return list.map((item) => {
    const fullDoc = documents.find((doc) => doc.id === item[key]?.id);
    return { ...item, [key]: fullDoc || item[key] };
  });
}

function extractAssetsFromData(data) {
  const urls = [];

  function scan(obj) {
    if (!obj) return;

    if (Array.isArray(obj)) {
      obj.forEach(scan);
    } else if (typeof obj === "object") {
      for (const key in obj) {
        const value = obj[key];
        if (value && typeof value === "object" && value.url) {
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
  const { contactpage } = await fetchContactPage();
  const albums = await fetchAlbums();

  //On ne preload pas les reels ni les news
  const homepageDataFiltered = {
    ...homepage.data,
    news_list: undefined,
    reels_list: undefined,
  };

  const assets = extractAssetsFromData(homepageDataFiltered);

  return {
    homepage,
    contactpage,
    assets,
    albums,
  };
}
module.exports = fetchPrismicData;
