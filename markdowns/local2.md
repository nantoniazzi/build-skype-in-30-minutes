# Welcome!

The source code is on [GitHub](https://github.com/nantoniazzi/build-skype-in-30-minutes), please feel free
to come up with proposals to improve it.

In this playground, we will see how to use WebRTC to create a simple skype-like web application to make video calls.

*Note: you need a local webcam for this playground to work.*

# WebRTC

WebRTC is a set of APIs and protocols which allow easy streaming of video and audio directly
from local cameras and microphones to someone else's browser.

Is it now supported by all major browsers.

At the client level, WebRTC is implemented through two APIs: `MediaStream` and `RTCPeerConnection`

# MediaStream

The MediaStream API provides access to the media streams of local cameras and microphones.

Once you get hold of a MediaStream object you can either output it into a video or audio HTML element or send it to another
peer using the RTCPeerConnection API.

## Rendering the webcam stream into a &lt;video&gt; element

The `getUserMedia()` method is the primary way to access local input devices.

```javascript
var promise = navigator.mediaDevices.getUserMedia(constraints);
```

Let's create a simple WebRTC application: within a video HTML element we display the local webcam feed. The browser will
take care of asking the user permission to use the webcam.

@[Webcam demo]({"stubs":["local/sample1/client.js"], "command":"sh /project/target/local/sample1/run.sh"})

> We access the `getUserMedia` function which returns a promise with the stream coming from the user's device.
Then we load our stream into the video element using `window.URL.createObjectURL` which creates a URL representing
the object given in parameter.

## Sending video output to a peer

The RTCPeerConnection API is the core of the peer-to-peer connection between each of the browsers.
To create the RTCPeerConnection objects simply write

```javascript
var peer = RTCPeerConnection(configuration);
```

@[Webcam demo]({"stubs":["local/sample2/client.js", "local/sample2/index.html", "local/sample2/main.css"], "command":"sh /project/target/local/sample2/run.sh"})

In this example we connect two peers within the same browser, simulating a local to remote connection.

The local stream obtained using `getUserMedia` is sent from peer1 (local, caller) to peer2 (remote, callee).

The local stream and the stream from peer2 are both displayed in &lt:video&gt; elements.

## Caller

```javascript
// servers is an optional config parameter (STUN and TURN servers configuration, will be explained in a more advanced playground)
peer1 = new RTCPeerConnection(servers);
peer1.addStream(localStream);
```

Create an offer and set it as the local description for `peer1` and as the remote description for `peer2`. This can be done directly in the code without using signaling, because both caller and callee are on the same page:

```javascript
peer1.createOffer(function(offer) {
  peer1.setLocalDescription(offer);
  peer2.setRemoteDescription(offer);
  peer2.createAnswer(function(answer) {
    
  };
});
```

## Callee

Create `peer2` and, when the stream from `peer1` is added, display it in a video element:

```javascript
peer2 = new RTCPeerConnection(servers);
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
