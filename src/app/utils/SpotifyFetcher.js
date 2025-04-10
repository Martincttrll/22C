const client_id = process.env.SPOTIFY_ID; // Ton Client ID
const client_secret = process.env.SPOTIFY_SECRET; // Ton Client Secret

export async function GET(req) {
  const token = await getSpotifyToken();
  const artistId = process.env.NEXT_PUBLIC_ARTIST_ID;

  try {
    const artistResponse = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/albums`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const artistData = await artistResponse.json();
    const albums = artistData.items;

    // Fetch tracks for each album
    const albumsWithTracks = await Promise.all(
      albums.map(async (album) => {
        const tracksResponse = await fetch(
          `https://api.spotify.com/v1/albums/${album.id}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const tracksData = await tracksResponse.json();
        const filteredTracks = tracksData.items.filter((track) =>
          track.artists.some((artist) => artist.id === artistId)
        );
        return {
          ...album,
          tracks: filteredTracks,
        };
      })
    );

    // Traitement des données pour le rendu
    const sortedAlbums = [...albumsWithTracks].sort((a, b) => {
      const dateA = new Date(a.release_date);
      const dateB = new Date(b.release_date);
      return dateB - dateA;
    });

    const isSingle = (album) => {
      return album.tracks.length === 1 && album.tracks[0].name === album.name;
    };

    const singleNames = sortedAlbums
      .filter(isSingle)
      .map((single) => single.name);

    const filteredAlbums = sortedAlbums.filter((album) => {
      if (isSingle(album)) {
        return !singleNames.some((name) =>
          sortedAlbums.some(
            (otherAlbum) => otherAlbum !== album && otherAlbum.name === name
          )
        );
      }
      return true;
    });

    const formattedAlbums = filteredAlbums.map((album) => ({
      ...album,
      tracks: album.tracks.map((track, index) => {
        const featuredArtists = track.artists
          .filter(
            (artist) =>
              artist.id !== artistId && !track.name.includes("22Carbone")
          )
          .map((artist) => artist.name)
          .join(", ");

        const trackName = featuredArtists
          ? `${track.name} (ft. ${featuredArtists})`
          : track.name;

        return {
          ...track,
          name: trackName,
          index: index >= 9 ? index + 1 : "0" + (index + 1),
        };
      }),
    }));

    return new Response(JSON.stringify(formattedAlbums), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error fetching artist info:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }
}

async function getSpotifyToken() {
  const authOptions = {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-store",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  };

  const response = await fetch(
    "https://accounts.spotify.com/api/token",
    authOptions
  );
  const data = await response.json();
  return data.access_token;
}
