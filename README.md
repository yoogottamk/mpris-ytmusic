# mpris integration for YouTube Music

This firefox extentsion provides access to YouTube music tracks via mpris.

### What does that mean?
Doing something in some other tab or outside the browser and want to change the current track? Want to pause the song?

With this, you no longer need to open the ytmusic tab. You can now directly use the buttons (or playerctl and similar controllers) to control playback.

### Other benefits
 - polybar integration (script and polybar config can be found in [my dotfiles](https://github.com/yoogottamk/dotfiles); will be integrated here soon)

### How do I install it
 - Go to the releases tab
 - Download the latest release
 - Open firefox and go to `about:addons`
 - Click on the cog icon
 - `Install Add-On From File`
 - Select this file

### How to use
 - Close this repo
 - `npm i`
 - `node main.js` --> this can be placed in some startup script
