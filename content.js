// observe and send metadata
const targetElements = [document.querySelector("video"), document.querySelector(".middle-controls yt-formatted-string.title")],
  // gets metadata from the page and returns a dict
  getMetadata = () => {
    if(window.getComputedStyle(document.querySelector("#player-bar-background")).height == "0px") {
      // no song is playing and this is hidden
      return {
        "title": "",
        "artist": [""],
        "time": "0:00 / 0:00",
        "paused": null,
      };
    }

    const {title} = document.querySelector(".middle-controls yt-formatted-string"),
      artist = [document.querySelector(".middle-controls a.yt-simple-endpoint.style-scope").text],
      time = document.querySelector(".time-info").textContent.trim(),
      {paused} = document.querySelector("video");

    return {
      "title": title,
      "artist": artist,
      "time": time,
      "paused": paused,
    };
  },
  // sends the metadata to background script
  sendMetadata = async () => {
    res = await browser.runtime.sendMessage(getMetadata());
  },
  // listens for changes and sends metadata to background script
  obs = new MutationObserver(_ => {
    sendMetadata();
  });

for (const el of targetElements) {
  obs.observe(el, { attributes: true });
}

// receive and act on events
const performAction = data => {
  const {action} = data;

  switch (action) {
  case "pause":
    document.querySelector("video").pause();
    break;
  case "play":
    document.querySelector("video").play();
    break;
  case "playpause":
    document.querySelector("#play-pause-button").click();
    break;
  case "next":
    document.querySelector(".next-button").click();
    break;
  case "previous":
    document.querySelector(".previous-button").click();
    break;
  case "status":
    // this was added to send initial metadata to the mpris daemon
    break;
  }

  sendMetadata();
};

browser.runtime.onMessage.addListener(performAction);
