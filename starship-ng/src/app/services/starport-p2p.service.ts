import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StarportP2pService {

  allPeers: PeerPlayer[];
  peers: {[name: string]: PeerPlayer};

  constructor(private http: HttpClient) {
    this.allPeers = [];
    this.peers = {};
  }

  addPeer(connected: ()=>void) {
    const peer = new PeerPlayer(connected)
    this.allPeers.push(peer);
    return peer;
  }

  async callPeer(peer: PeerPlayer, complete: () => void): Promise<PeerPlayer> {
    peer.complete = complete;
    peer.rtc.status = 'connecting';
    await peer.rtc.offerToken(() => {
      console.log('got rtc', peer.rtc.localtoken);
      peer.rtc.status = 'coding token';
      this.http.post<string>(
        environment.endpoint + '/token', 
        peer.rtc.localtoken
      ).toPromise().then(r => {
        peer.rtc.status = 'got local token';
        peer.localcode = r;
        peer.complete();
      });
    });
    return peer;
  }

  async confirmPeer(peer: PeerPlayer): Promise<void> {
    const needsToken = peer.rtc.localtoken ? false: true;
    peer.rtc.remotetoken = await this.http.get<TokenDto>(`${environment.endpoint}/token/${peer.remotecode}`).toPromise();
    await peer.rtc.acceptToken();
    if (needsToken && peer.rtc.localtoken) {
      peer.localcode = await this.http.post<string>(
        environment.endpoint + '/token', 
        peer.rtc.localtoken
      ).toPromise();      
    }
  }

}

export class PeerPlayer {
  localcode: string;
  remotecode: string;
  rtc: RtcPeer;
  complete: () => void;

  constructor(connected: ()=>void) {
    this.rtc = new RtcPeer(connected);
  }

  send(message: string) {
    this.rtc.dataChannel.send(message);
  };

  receive(callback: (data:string)=>void) {
    this.rtc.dataChannel.onmessage = e => {
      console.log('received event', e);
      callback(e.data);
    };
  }

}

export class RtcPeer {

  peerConnection: RTCPeerConnection;
  iceCandidates: RTCIceCandidate[];
  dataChannel: RTCDataChannel;
  status: string;
  connectedCallback: ()=>void;

  localrtc: RTCSessionDescriptionInit;
  remotertc: RTCSessionDescriptionInit;
  localtoken: TokenDto;
  remotetoken: TokenDto;

  constructor(connected: ()=>void) { 
    this.connectedCallback = connected;
    this.iceCandidates = [];
    this.peerConnection = new RTCPeerConnection({ iceServers: [ { urls: 'stun:stun.l.google.com:19302' } ] });
    this.peerConnection.onicecandidate = (e:RTCPeerConnectionIceEvent) => {
      console.log('peerConnection.onicecandidate', e);
      if (e.candidate) {
        this.iceCandidates.push(e.candidate);
      }
    };
    this.peerConnection.ondatachannel = e => {
      this.dataChannel = e.channel;
      this.setUpDataChannel();
    };
  }

  private setUpDataChannel() {
    this.dataChannel.onopen = () => {
      console.log('open');
      //this.localDataChannel.send('message from answerer');
      this.status = 'connected';
      this.connectedCallback();
    };
    this.dataChannel.onmessage = e => {
      console.log('received:', e.data);
    };
    this.dataChannel.onerror = e => {
      console.log('error:', e);
    };
    this.dataChannel.onclose = () => {
      console.log('dataChannel closed');
    };
  }

  async offerToken(complete: () => void) {
    this.dataChannel = this.peerConnection.createDataChannel('mydatachannel');
    this.setUpDataChannel();
    this.peerConnection.onicegatheringstatechange = () => {
      console.log(this.peerConnection.iceGatheringState);
      if (this.peerConnection.iceGatheringState === 'complete') {
        this.localtoken = TokenDto.pack({ rtc: this.localrtc, iceCandidates: this.iceCandidates });
        complete();
      }
    };
    this.localrtc = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(this.localrtc);
  }

  async acceptToken() {
    const { rtc, iceCandidates } = TokenDto.unpack(this.remotetoken);
    this.remotertc = rtc;
    console.log('remotetoken unpacked', this.remotertc, iceCandidates);
    await this.peerConnection.setRemoteDescription(this.remotertc);
    if (!this.localrtc) {
      this.localrtc = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(this.localrtc);
      this.localtoken = TokenDto.pack({ rtc: this.localrtc, iceCandidates: iceCandidates });
      console.log('localtoken', this.localtoken);
    }
    iceCandidates.forEach(c => this.peerConnection.addIceCandidate(c));
  };

  send(message: string) {
    this.dataChannel.send(message);
  }

}

class TokenDto {

  token: string;

  static pack(item: any): TokenDto {
    const dto = new TokenDto();
    dto.token = btoa(JSON.stringify(item));
    return dto;
  }

  static unpack(dto: TokenDto): any {
    return JSON.parse(atob(dto.token));
  }

}