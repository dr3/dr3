const fetch = require("node-fetch");
const secrets = require("./secrets.json");

const today = new Date().toJSON().slice(0, 10).replace(/-/g, "/");

const getTable = (tracks, artists) => {
  const lines = [
    `### My spotify favs atm`,
    `(updated ${today})`,
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

const getImage1 = (thing) =>
  `<img src="${
    (thing.album ? thing.album.images : thing.images).pop().url
  }" alt="Photo of ${thing.name}" width="9%" />`;

const template = (artists, tracks) => {
  const lines = [
    "# Hi there, I'm Drew 👋",
    "🔭 I’m currently working on awesome JS stuff [@trainline](http://trainline.com/)  ",
    "📫 How to reach me: [drew.mx/contact](https://drew.mx/contact)  ",
    "⚡ Fun fact: A crocodile can’t poke its tongue out.  ",
    // ...getTable(tracks, artists),
    tracks.map(getImage1).join(""),
  ];

  return lines.join("\n");
};

const spotifyFetch = (type) =>
  fetch(
    `https://api.spotify.com/v1/me/top/${type}?time_range=short_term&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${secrets.spotifyAuth}`,
      },
    }
  )
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
