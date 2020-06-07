const Player = require("mpris-service"),
  io = require("socket.io")(9999),
  second2milli = 1000,
  seconds2micro = second2milli * second2milli,
  events = ["play", "pause", "playpause", "next", "previous"],
  metadata = {
    "title": "",
    "length": 0,
    "artist": [""],
  };

player = Player({
  name: "YTMusic",
  identity: "YouTube Music mpris",
  supportedInterfaces: ["player"]
});

let state = Player.PLAYBACK_STATUS_STOPPED;

for (const event of events) {
  player.on(event, () => {
    io.emit(event);
  });
}

io.on("connection", socket => {
  socket.on("metadata", data => {
    metadata.length= data.length;
    metadata.title= data.title;
    metadata.artist= data.artist;
    state = data.playing;
  });
});

setInterval(() => {
  player.metadata = {
    "mpris:length": metadata.length * seconds2micro,
    "xesam:title": metadata.title,
    "xesam:artist": metadata.artist,
  };

  if(state) {
    player.playbackStatus = Player.PLAYBACK_STATUS_PLAYING;
  } else {
    player.playbackStatus = Player.PLAYBACK_STATUS_PAUSED;
  }

}, second2milli);

player.on("quit", () => {
  process.exit();
});
