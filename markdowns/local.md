The MediaStream API was designed to easy access the media streams from local cameras and microphones.

The API has a few key points
- A real-time media stream is represented by a stream object in the form of video or audio
- It provides a security level through user permissions asking the user before a web application can start fetching a stream
- The selection of input devices is handled by the MediaStream API (for example, when there are two cameras or microphones connected to the device)
- Each MediaStream object includes several MediaStreamTrack objects. They represent video and audio from different input devices.
- Each MediaStreamTrack object may include several channels (right and left audio channels). These are the smallest parts defined by the MediaStream API.

There are two ways to output MediaStream objects. First, we can render output into a video or audio element. Secondly, we can send output to the RTCPeerConnection object, which then send it to a remote peer.

# Render the media output to a video

The `getUserMedia()` method is the primary way to access local input devices.

```javascript
var promise = navigator.mediaDevices.getUserMedia(constraints);
```

Let's create a simple WebRTC application. It will show a video element on the screen, ask the user permission to use the camera, and show a live video stream in the browser.

@[Webcam demo]({"stubs":["local/sample1/client.js"], "command":"sh /project/target/local/sample1/run.sh"})

> We access the `getUserMedia` function which returns a promise with the stream coming from the user's device. Then we load our stream into the video element using `window.URL.createObjectURL` which creates a URL representing the object given in parameter.

# Send video output to a peer

The RTCPeerConnection API is the core of the peer-to-peer connection between each of the browsers. To create the RTCPeerConnection objects simply write

```javascript
var pc = RTCPeerConnection(configuration);
```

@[Webcam demo]({"stubs":["local/sample2/client.js", "local/sample2/index.html", "local/sample2/main.css"], "command":"sh /project/target/local/sample2/run.sh"})

In this example, `pc1` represents the local peer (caller) and `pc2` represents the remote peer (callee).

## Caller

```javascript
// servers is an optional config parameter (see TURN and STUN discussions later)
pc1 = new RTCPeerConnection(servers);
pc1.addStream(localStream);
```

Create an offer and set it as the local description for `pc1` and as the remote description for `pc2`. This can be done directly in the code without using signaling, because both caller and callee are on the same page:

```javascript
pc1.createOffer(function(desc) {
  pc1.setLocalDescription(desc);
  pc2.setRemoteDescription(desc);
  pc2.createAnswer(gotDescription2);
});
```

## Callee

Create `pc2` and, when the stream from `pc1` is added, display it in a video element:

```javascript
pc2 = new RTCPeerConnection(servers);
pc2.onaddstream = function(e){
  vid2.src = URL.createObjectURL(e.stream);
};
```

In the real world, WebRTC needs servers, however simple, so the following can happen:

1. Users discover each other and exchange 'real world' details such as names.
2. WebRTC client applications (peers) exchange network information.
3. Peers exchange data about media such as video format and resolution.
4. WebRTC client applications traverse NAT gateways and firewalls.


In other words, WebRTC needs four types of server-side functionality:

- User discovery and communication.
- Signaling.
- NAT/firewall traversal.
- Relay servers in case peer-to-peer communication fails.

The next chapter will illustrate the implementation of the server part to handle user discovery and signaling.