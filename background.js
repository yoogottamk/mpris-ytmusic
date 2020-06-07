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
const notify = metadata => {
  socket.emit("metadata", metadata);
};

browser.runtime.onMessage.addListener(notify);
