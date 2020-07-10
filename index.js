const fetch = require("node-fetch");
const secrets = require("./secrets.json");

const today = new Date().toJSON().slice(0, 10).replace(/-/g, "/");

const template = (artists, tracks) => {
  const lines = [
    "# Hi there, I'm Drew 👋",
    "🔭 I’m currently working on awesome JS stuff [@trainline](http://trainline.com/)  ",
    "📫 How to reach me: [drew.mx/contact](https://drew.mx/contact)  ",
    "⚡ Fun fact: A crocodile can’t poke its tongue out.  ",
    `### My spotify favs atm`,
    `(updated ${today})`,
    "| top artists | top tracks |",
    "|-------------|------------|",
  ];

  for (let x = 0; x < artists.length && x < tracks.length; x++) {
    lines.push(`| ${artists[x]} | ${tracks[x]} |`);
  }

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
    .then((json) => json.items);

const getImage = (thing) =>
  `<img src="${thing.album.images.pop().url}" alt="Photo of ${
    thing.name
  }" width="40px" />`;

const process = async () => {
  const tracks = await spotifyFetch("tracks");
  const artists = await spotifyFetch("artists");

  const tracksOutput = tracks.map(
    (track, index) =>
      `${getImage(track)}[${track.name} - ${track.artists
        .map((artist) => artist.name)
        .join()}](${track.external_urls.spotify})`
  );

  const artistsOutput = artists.map(
    (artist, index) =>
      `${index + 1}) [${artist.name}](${artist.external_urls.spotify})`
  );

  console.log(template(artistsOutput, tracksOutput));
};

process();
