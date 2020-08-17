const Player = require("mpris-service"),
  io = require("socket.io")(9999),
  second2milli = 1000,
  seconds2micro = second2milli * second2milli,
  events = ["play", "pause", "playpause", "next", "previous", "status"];

let metadata = {
  "title": "",
  "length": 0,
  "position": 0,
  "artist": [""],
};

player = Player({
  name: "YTMusic",
  identity: "YouTube Music mpris",
  supportedInterfaces: ["player"]
});

let isPaused = null;

for (const event of events) {
  player.on(event, () => {
    io.emit(event);
  });
}

io.on("connection", socket => {
  socket.on("metadata", data => {
    metadata = data;
    isPaused = metadata.paused;
  });

  // get status as soon as connection is established
  io.emit("status");
});

setInterval(() => {
  if (isPaused === false) {
    metadata.position += 1;
  }

  player.metadata = {
    "mpris:position": Math.round(metadata.position * seconds2micro),
    "mpris:length": Math.round(metadata.length * seconds2micro),
    "xesam:title": metadata.title,
    "xesam:artist": metadata.artist,
  };

  if (isPaused == null) {
    player.playbackStatus = Player.PLAYBACK_STATUS_STOPPED;
  } else if (isPaused) {
    player.playbackStatus = Player.PLAYBACK_STATUS_PAUSED;
  } else {
    player.playbackStatus = Player.PLAYBACK_STATUS_PLAYING;
  }

}, second2milli);

player.on("quit", () => {
  process.exit();
});
