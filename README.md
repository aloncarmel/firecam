# firecamera
Firecam lets you broadcast simple video using your html5 canvas camera using firebase to the internet. a very simple solution for broadcasting lagging video without any servers.
The script mainly takes a canvas html5 base64 string and broadcasts it to firebase, the watcher page listens for updates and update the preview image accordingly. simple crud solution when you dont have any servers and you just need a simple video feed.

# broadcaster.html
This page lets you broadcast your feed to firebase server (Note that you are using currently a mock firecamera url that i use, please avoid using this in production).
The script init a random broadcasterid and sends a base64 every 1 second to firebase.

# watcher.html
This page lets you watch a broadcast via a url param c?=broadcasterid, this should be identical to the id that you got from the broadcaster.html file, or any other id that you want for that matter. as long as its an active broadcast.

# credit
Html5 code taken from here http://demo.creative-jar.com/html5-camera/
Inspired from a kid doing this in a hackathon i was mentoring here https://www.facebook.com/AppToYouth
