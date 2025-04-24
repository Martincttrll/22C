require("dotenv").config();

const clientId = process.env.SPOTIFY_ID;
const clientSecret = process.env.SPOTIFY_SECRET;

async function getToken() {
  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  const data = await response.json();
  return data.access_token;
}

async function getAlbums(artistId, token) {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/albums?limit=50`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  return data.items;
}

async function getTracks(albumId, token) {
  const response = await fetch(
    `https://api.spotify.com/v1/albums/${albumId}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  return data.items;
}

function normalize(str) {
  return str.trim().toLowerCase();
}

function isDurationClose(d1, d2, toleranceMs = 2000) {
  return Math.abs(d1 - d2) <= toleranceMs;
}

module.exports = async function () {
  const artistId = process.env.ARTIST_ID;
  const token = await getToken();
  const albums = await getAlbums(artistId, token);
  const albumsWithTracks = [];

  for (const album of albums) {
    const tracks = await getTracks(album.id, token);

    // Vérifiez que `tracks` est défini et contient des éléments
    if (!tracks || tracks.length === 0) {
      console.warn(`No tracks found for album: ${album.name}`);
      continue;
    }

    const filteredTracks = tracks.filter((track) =>
      track.artists.some((artist) => artist.id === artistId)
    );

    if (filteredTracks.length > 0) {
      albumsWithTracks.push({
        id: album.id,
        name: album.name,
        release_date: album.release_date,
        cover: album.images?.[0]?.url || null,
        spotify_url: album.external_urls?.spotify || null,
        tracks: filteredTracks.map((track) => ({
          name: track.name,
          duration_ms: track.duration_ms,
          featuring: track.artists
            .filter((a) => a.id !== artistId)
            .map((a) => a.name),
          spotify_url: track.external_urls?.spotify || null,
        })),
      });
    }
  }

  // Tri par date de sortie
  const sortedAlbums = albumsWithTracks.sort(
    (a, b) => new Date(b.release_date) - new Date(a.release_date)
  );

  // Détection des singles (1 seul track, même nom que l’album)
  const singles = sortedAlbums.filter(
    (album) =>
      album.tracks.length === 1 &&
      normalize(album.tracks[0].name) === normalize(album.name)
  );

  // Détection des doublons dans d'autres albums
  const duplicateSingles = singles.filter((single) => {
    const singleTrack = single.tracks[0];

    return sortedAlbums.some(
      (album) =>
        album.id !== single.id &&
        album.tracks.some(
          (track) =>
            normalize(track.name) === normalize(singleTrack.name) &&
            isDurationClose(track.duration_ms, singleTrack.duration_ms)
        )
    );
  });

  const duplicateSingleIds = new Set(duplicateSingles.map((s) => s.id));

  const finalAlbums = sortedAlbums.filter(
    (album) => !duplicateSingleIds.has(album.id)
  );
  console.log(finalAlbums);
  return finalAlbums;
};
