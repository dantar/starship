import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-peer-to-peer',
  templateUrl: './peer-to-peer.component.html',
  styleUrls: ['./peer-to-peer.component.scss']
})
export class PeerToPeerComponent implements OnInit {

  peerConnection: RTCPeerConnection;
  localDataChannel: RTCDataChannel;
  iceCandidates: any[];

  localtoken: string;
  remotetoken: string;

  localrtc: RTCSessionDescriptionInit;
  remotertc: RTCSessionDescriptionInit;

  constructor() { }

  ngOnInit(): void {
    // ice candidates
    this.iceCandidates = [];
    // peer connection
    this.peerConnection = new RTCPeerConnection({ iceServers: [ { urls: 'stun:stun.l.google.com:19302' } ] });
    this.peerConnection.onicecandidate = e => {
      console.log('peerConnection.onicecandidate', e);
      if (e.candidate) {
        this.iceCandidates.push(e.candidate);
      }
    };
    // this is to accept offers
    this.peerConnection.ondatachannel = e => {
      this.localDataChannel = e.channel;
      this.setUpDataChannel();
    };
    // setup
  }

  setUpDataChannel() {
    this.localDataChannel.onopen = () => {
      console.log(`dataChannel '${this.localDataChannel.label}' opened, sending message`);
      //this.localDataChannel.send('message from answerer');
    };
    this.localDataChannel.onmessage = e => {
      console.log('received:', e.data);
    };
    this.localDataChannel.onerror = e => {
      console.log('error:', e);
    };
    this.localDataChannel.onclose = () => {
      console.log('dataChannel closed');
    };
  }

  async setupOffer() {
    // const copyButton = document.getElementById('copy');
    this.localDataChannel = this.peerConnection.createDataChannel('mydatachannel');
    this.setUpDataChannel();
    const component = this;
    this.peerConnection.onicegatheringstatechange = () => {
      console.log(this.peerConnection.iceGatheringState);
      if (this.peerConnection.iceGatheringState === 'complete') {
        const offertoken = JSON.stringify({ rtc: this.localrtc, iceCandidates: component.iceCandidates });
        console.log('Offer ready, copy.', offertoken);
        component.offerReady(offertoken);
      }
    };

    this.localrtc = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(this.localrtc);

    const pasteInput = document.getElementById('paste');

    // pasteInput.onpaste = async (e) => {
    //   console.log('paste!', e);
    //   const { answer, iceCandidates } = JSON.parse(e.clipboardData.getData('text/plain'));
    //   await this.peerConnection.setRemoteDescription(answer);
    //   iceCandidates.forEach(c => this.peerConnection.addIceCandidate(c));
    // };

  }

  clickSetupOffer() {
    // data channel
    this.setupOffer();
  }

  offerReady(token: string) {
    this.localtoken = token;
  }

  clickCopyToken() {
    navigator.clipboard.writeText(this.localtoken);
  }

  clickAcceptToken() {
    console.log('click accept token', this.remotetoken);
    this.acceptToken();
  }

  // accept

  async acceptToken() {
    const { rtc, iceCandidates } = JSON.parse(this.remotetoken);
    this.remotertc = rtc;
    await this.peerConnection.setRemoteDescription(this.remotertc);
    if (this.localrtc) {

    } else {
      console.log("peerConnection.setRemoteDescription done");
      this.localrtc = await this.peerConnection.createAnswer();
      console.log("peerConnection.createAnswer done");
      await this.peerConnection.setLocalDescription(this.localrtc);
      console.log("peerConnection.createAnswer done");
      this.localtoken = JSON.stringify({ rtc: this.localrtc, iceCandidates: iceCandidates });
    }
    // copyButton.onclick = () => {
    //   navigator.clipboard.writeText(JSON.stringify({ this.answer, iceCandidates }));
    //   console.log('Copied answer/candidates. Paste in Offerer example.');
    // };
    iceCandidates.forEach(c => this.peerConnection.addIceCandidate(c));
  };

}