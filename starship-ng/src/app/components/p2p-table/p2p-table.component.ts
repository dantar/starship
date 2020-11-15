import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PeerPlayer, StarportP2pService } from 'src/app/services/starport-p2p.service';

@Component({
  selector: 'app-p2p-table',
  templateUrl: './p2p-table.component.html',
  styleUrls: ['./p2p-table.component.scss']
})
export class P2pTableComponent implements OnInit {

  messages: string[];

  constructor(
    public starport: StarportP2pService,
    private changes: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.messages = [];
  }

  clickAddPeer() {
    const peer = this.starport.addPeer(() => {
      peer.receive((data) => {
        console.log('a new message:', data);
        this.messages.push(data);
        this.changes.detectChanges();
      });
      this.changes.detectChanges();
    });;
  }

  clickCallPeer(peer) {
    this.callPeer(peer).catch(
      (error) => console.log('callPeer Error', error)
    );
    console.log('callPeer...', peer);
  }

  async callPeer(peer) {
    await this.starport.callPeer(peer, () => {
      console.log('peer complete!', peer);
      this.changes.detectChanges();
    });
    this.changes.detectChanges();
  }

  clickAnswerPeer(peer) {
    this.answerPeer(peer)
    .catch(
      (error) => {
        console.log('answerPeer Error', error);
        throw error;
      }
    );
  }

  async answerPeer(peer) {
    await this.starport.confirmPeer(peer);
    this.changes.detectChanges();
  }

  clickSendText(peer: PeerPlayer, input: HTMLInputElement) {
    peer.send(input.value);
    input.value = '';
  }

  clickCopyClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }


}
