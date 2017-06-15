'use strict';

var localStream;
var pc1;
var pc2;

var callButton = document.getElementById('callButton');
var hangupButton = document.getElementById('hangupButton');
var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');

callButton.disabled = false;
hangupButton.disabled = true;

// Acquire the media inputs, display it and store it in localStream
// (to send the stream accross the peer connection)
navigator.mediaDevices.getUserMedia({ audio: false, video: true })
    .then(function (stream) {
        localVideo.srcObject = localStream = stream;
    })

callButton.onclick = function () {
    callButton.disabled = true;
    hangupButton.disabled = false;

    var servers = null;

    // We create 2 Peer connection, one for each peer
    // (This is for a demo purpose, usually, you only have 1 peer connection)
    // The server parameter will be explained later
    pc1 = new RTCPeerConnection(servers);
    pc2 = new RTCPeerConnection(servers);

    // We send the local stream into the peer connection
    pc1.addStream(localStream);

    // Creates an offer which will generate a SDP (Session Description Protocol)
    // the SDP contains all informations attached to the session like codecs, supported
    // options, and the list of all the already connected candidadtes
    pc1.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
    }).then(function (desc) {
        // play with console.log(desc) or debugger to inspect the value of the desc.sdp;

        // We attach the desc as local description of pc1
        pc1.setLocalDescription(desc);
        
        // Now we should send the desc.dsp information to the pc2 (process of signaling,
        // described in the next chapter). For the demo purppose, we assume that it is
        // done and that we can assign the pc1 sdp as the the remote description on pc2
        pc2.setRemoteDescription(desc);

        // To complete the negociation, pc2 answer to the pc1 offer
        pc2.createAnswer().then(function (desc) {
            // Create answer generate the SDP of pc2. We assign the local description
            // value to pc2 and we should send the pc2 desc to pc1
            pc2.setLocalDescription(desc);
            
            // We assume that we have transfered the pc2 DSP to pc1 using a network mechanism
            pc1.setRemoteDescription(desc);
        });
    });

    pc2.onaddstream = function (e) {
        remoteVideo.srcObject = e.stream;
    }

    pc1.onicecandidate = function (e) {
        pc2.addIceCandidate(new RTCIceCandidate(e.candidate));
    };

    pc2.onicecandidate = function (e) {
        pc1.addIceCandidate(new RTCIceCandidate(e.candidate));
    };
};

hangupButton.onclick = function () {
    pc1.close();
    pc2.close();
    pc1 = null;
    pc2 = null;
    hangupButton.disabled = true;
    callButton.disabled = false;
};