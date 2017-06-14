The MediaStream API was designed to easy access the media streams from local cameras and microphones.

The API has a few key points
- A real-time media stream is represented by a stream object in the form of video or audio
- It provides a security level through user permissions asking the user before a web application can start fetching a stream
- The selection of input devices is handled by the MediaStream API (for example, when there are two cameras or microphones connected to the device)
- Each MediaStream object includes several MediaStreamTrack objects. They represent video and audio from different input devices.
- Each MediaStreamTrack object may include several channels (right and left audio channels). These are the smallest parts defined by the MediaStream API.

There are two ways to output MediaStream objects. First, we can render output into a video or audio element. Secondly, we can send output to the RTCPeerConnection object, which then send it to a remote peer.

### Render the media output to a video

The `getUserMedia()` method is the primary way to access local input devices.

```js
var promise = navigator.mediaDevices.getUserMedia(constraints);
```

Let's create a simple WebRTC application. It will show a video element on the screen, ask the user permission to use the camera, and show a live video stream in the browser.

@[Webcam demo]({"stubs":["local/sample1/client.js"], "command":"sh /project/target/local/sample1/run.sh"})

> We access the `getUserMedia` function which returns a promise with the stream coming from the user's device. Then we load our stream into the video element using `window.URL.createObjectURL` which creates a URL representing the object given in parameter.

### Send video output to a peer

The RTCPeerConnection API is the core of the peer-to-peer connection between each of the browsers. To create the RTCPeerConnection objects simply write

```js
var pc = RTCPeerConnection(configuration);
```

## WIIIIIPPP

@[Webcam demo]({"stubs":["local/sample2/client.js", "local/sample2/index.html", "local/sample2/main.css"], "command":"sh /project/target/local/sample2/run.sh"})
