const socket = io("http://localhost:9999"),
  getYTMusicTab = async () => {
    const tabs = await browser.tabs.query({url: "*://music.youtube.com/*"});
    return tabs[0];
  },
  events = ["pause", "play", "playpause", "next", "previous", "status"];

// send events to content script
let cachedTab = null;

const sendMessage = async ev => {
  if(!cachedTab) {
    cachedTab = await getYTMusicTab();
  }

  try {
    browser.tabs.sendMessage(cachedTab.id, {"action": ev});
  } catch(err) {
    cachedTab = await getYTMusicTab();

    browser.tabs.sendMessage(cachedTab.id, {"action": ev});
  }
};

for (const ev of events) {
  socket.on(ev, async () => {
    await sendMessage(ev);
  });
}

// receive and forward metadata
const notify = data => {
  const {title, artist, time, paused} = data,
    [min, sec] = time.split(" ")[2].split(":").map(x => +x),
    metadata = {
      "title": title,
      "artist": artist,
      "length": min * 60 + sec,
      "paused": paused
    };

  socket.emit("metadata", metadata);
};

browser.runtime.onMessage.addListener(notify);
