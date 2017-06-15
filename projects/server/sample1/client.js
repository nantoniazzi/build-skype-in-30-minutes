// { autofold
'use strict';

var localStream; // medial (webcam) local stream

var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');
var shareUrl = document.getElementById('shareUrl');

var peer = null;

var offerOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
};

shareUrl.value = document.location.href;
// Acquire the media inputs, display it and store it in localStream
// (to send the stream accross the peer connection)
navigator.mediaDevices.getUserMedia({ audio: false, video: true })
    .then(function (stream) {
        localVideo.srcObject = localStream = stream;
        register();
    })

// }

var pollCandidates = function() {
    fetch('/getCandidates', {
        headers: { 'Content-Type': 'application/json' }
    })
    .then((resp) => resp.json())
    .then(function(data) {
        for(var i = 0; i < data.length; i++) {
            peer.addIceCandidate(new RTCIceCandidate(data[i]));
        }
    });

    setTimeout(pollCandidates, 1000);
}

var register = function() {
    var servers = { 
         "iceServers": [{ "url": "stun:stun.1.google.com:19302" }] 
      };
    peer = new RTCPeerConnection(servers);
    peer.addStream(localStream);
    peer.onaddstream = function (e) {
        debugger;
        if (e.stream) remoteVideo.srcObject = e.stream;
    }
    peer.onicecandidate = function (e) {
        if(e.candidate) {
//            peer.addIceCandidate(new RTCIceCandidate(e.candidate));
            fetch('/candidate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(e.candidate)
            })
            .then(function(data) {
                console.log('done');
            });
        }
    };
    
    fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    .then((resp) => resp.json())
    .then(function(data) {
        if(data.role === 'makeOffer') {
            makeOffer();
        } else if(data.role === 'pollOffer') {
            pollOffer();
        }
    });
};

var pollAnswer = function() {
    fetch('/getAnswer', {
        headers: { 'Content-Type': 'application/json' }
    })
    .then((resp) => resp.json())
    .then(function(data) {
        if(!data.desc) {
            setTimeout(pollAnswer, 1000);
        } else {
            console.log('remote =>', data.desc);
            peer.setRemoteDescription(data.desc);
        }
    });
};

var makeOffer = function () {
    peer.createOffer().then(function (desc) {
        peer.setLocalDescription(desc);
        fetch('/offer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ desc: desc })
        })
        .then(function(data) {
            pollAnswer();
        });
    });
};

var pollOffer = function() {
    
    fetch('/getOffer', {
        headers: { 'Content-Type': 'application/json' }
    })
    .then((resp) => resp.json())
    .then(function(data) {
        if(!data.desc) {
            setTimeout(pollOffer, 1000);
        } else {
            //debugger;
            peer.setRemoteDescription(data.desc);
            peer.createAnswer().then(function(desc) {
                peer.setLocalDescription(desc);
//                peer.setRemoteDescription(data.desc);
                
                fetch('/answer', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ desc: desc })
                })
                .then(function(data) {
                    if(data.role === 'makeOffer') {
                        makeOffer();
                    } else if(data.role === 'pollOffer') {
                        pollOffer();
                    }
                });

            });
        }
    });
}

// }