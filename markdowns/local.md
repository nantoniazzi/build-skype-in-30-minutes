The MediaStream API was designed to easy access the media streams from local cameras and microphones. The getUserMedia() method is the primary way to access local input devices.

The API has a few key points
- A real-time media stream is represented by a stream object in the form of video or audio
- It provides a security level through user permissions asking the user before a web application can start fetching a stream
- The selection of input devices is handled by the MediaStream API (for example, when there are two cameras or microphones connected to the device)
- Each MediaStream object includes several MediaStreamTrack objects. They represent video and audio from different input devices.
- Each MediaStreamTrack object may include several channels (right and left audio channels). These are the smallest parts defined by the MediaStream API.

There are two ways to output MediaStream objects. First, we can render output into a video or audio element. Secondly, we can send output to the RTCPeerConnection object, which then send it to a remote peer.

Using the MediaStream API
Let's create a simple WebRTC application. It will show a video element on the screen, ask the user permission to use the camera, and show a live video stream in the browser.

@[Webcam demo]({"stubs":[client.js], "command":"sh /project/target/local/sample1/run.sh"})

Here we create the hasUserMedia() function which checks whether WebRTC is supported or not. Then we access the getUserMedia function where the second parameter is a callback that accept the stream coming from the user's device. Then we load our stream into the video element using window.URL.createObjectURL which creates a URL representing the object given in parameter.
