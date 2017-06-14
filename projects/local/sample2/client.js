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

navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    })
    .then(function (stream) {
        localVideo.srcObject = localStream = stream;
    })

callButton.onclick = function () {
    callButton.disabled = true;
    hangupButton.disabled = false;

    var servers = null;

    pc1 = new RTCPeerConnection(servers);
    pc2 = new RTCPeerConnection(servers);

    pc1.addStream(localStream);

    pc1.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
    }).then(function (desc) {
        debugger;
        pc1.setLocalDescription(desc);
        pc2.setRemoteDescription(desc);

        // Since the 'remote' side has no media stream we need
        // to pass in the right constraints in order for it to
        // accept the incoming offer of audio and video.
        pc2.createAnswer().then(function (desc) {
            pc2.setLocalDescription(desc);
            pc1.setRemoteDescription(desc);
        });
    });

    pc2.onaddstream = function (e) {
        remoteVideo.srcObject = e.stream;
    }

    pc1.onicecandidate = function (e) {
        pc2.addIceCandidate(new RTCIceCandidate(event.candidate));
    };


    pc2.onicecandidate = function (e) {
        pc1.addIceCandidate(new RTCIceCandidate(event.candidate));
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