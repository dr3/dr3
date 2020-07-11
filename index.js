const fetch = require("node-fetch");
const secrets = require("./secrets.json");

const today = new Date().toJSON().slice(0, 10).replace(/-/g, "/");

const getTable = (tracks, artists) => {
  const lines = [
    "| top artists | top tracks |",
    "|-------------|------------|",
  ];

  const tracksOutput = tracks.map(
    (track) =>
      `${getImage(track)} [${track.name} - ${track.artists
        .map((artist) => artist.name)
        .join()}](${track.external_urls.spotify})`
  );

  const artistsOutput = artists.map(
    (artist) =>
      `${getImage(artist)} [${artist.name}](${artist.external_urls.spotify})`
  );

  for (let x = 0; x < artistsOutput.length && x < tracksOutput.length; x++) {
    lines.push(`| ${artistsOutput[x]} | ${tracksOutput[x]} |`);
  }

  return lines;
};

const getLargeImage = (thing) => {
  const images = thing.album ? thing.album.images : thing.images;

  const image = images[1] || images[0];

  return `[<img src="${image.url}" alt="Photo of ${thing.name}" width="10%" />](${thing.external_urls.spotify})`;
};

const getTracksImage = (type) => {
  const images = {
    artists:
      "https://user-images.githubusercontent.com/11341355/87235261-2df80980-c3d2-11ea-9f63-cf4737f9897f.png",
    tracks:
      "https://user-images.githubusercontent.com/11341355/87235266-3b14f880-c3d2-11ea-8c38-e2d45617b020.png",
  };

  return `<img src="${images[type]}" alt="My top ${type}" width="10%" />`;
};

const template = (artists, tracks) => {
  const lines = [
    "# Hi there, I'm Drew 👋",
    "🔭 I’m currently working on awesome JS stuff [@trainline](http://trainline.com/)  ",
    "📫 How to reach me: [drew.mx/contact](https://drew.mx/contact)  ",
    "⚡ Fun fact: A crocodile can’t poke its tongue out.  ",
    // ...getTable(tracks, artists),
    "### My top Spotify tracks & artists",
    [getTracksImage("tracks"), ...tracks.map(getLargeImage)].join(""),
    [getTracksImage("artists"), ...artists.map(getLargeImage)].join(""),
    `<details>`,
    `<summary>(last updated ${today})</summary>`,
    ``,
    ...getTable(tracks, artists),
    ``,
    `</details>`,
  ];

  return lines.join("\n");
};

const spotifyFetch = (type) =>
  fetch(`https://api.spotify.com/v1/me/top/${type}?limit=9`, {
    headers: {
      Authorization: `Bearer ${secrets.spotifyAuth}`,
    },
  })
    .then((res) => res.json()) // expecting a json response
    .then((json) => {
      return json.items;
    });

const getImage = (thing) =>
  `<img src="${
    (thing.album ? thing.album.images : thing.images).pop().url
  }" alt="Photo of ${thing.name}" width="40px" />`;

const process = async () => {
  const tracks = await spotifyFetch("tracks");
  const artists = await spotifyFetch("artists");

  console.log(template(artists, tracks));
};

process();
