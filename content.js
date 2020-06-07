// observe and send metadata
const targetElements = [document.querySelector("video"), document.querySelector(".middle-controls yt-formatted-string.title")],
  obs = new MutationObserver(_ => {
    const {title} = document.querySelector(".middle-controls yt-formatted-string"),
      artist = [document.querySelector(".middle-controls a.yt-simple-endpoint.style-scope").text],
      time = document.querySelector(".time-info").textContent.trim(),
      {paused} = document.querySelector("video");

    browser.runtime.sendMessage({
      "title": title,
      "artist": artist,
      "time": time,
      "paused": paused
    });
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
  }
};

browser.runtime.onMessage.addListener(performAction);
