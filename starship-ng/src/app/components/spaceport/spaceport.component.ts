import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-spaceport',
  templateUrl: './spaceport.component.html',
  styleUrls: ['./spaceport.component.scss']
})
export class SpaceportComponent implements OnInit {

  constructor(private http: HttpClient) { }

  sse: EventSource;

  codes: string[];

  ngOnInit(): void {
    this.codes = [];
    this.sse = new EventSource(environment.endpoint + '/spaceport/player/daniele/sse');
    this.sse.addEventListener('message', (message: any) => {
      let data = JSON.parse(message.data);
      this.codes.push(data.code);
      console.log(message);
    })
    this.sse.addEventListener('open', (open) => {
      console.log('open', open);
    })
    this.sse.addEventListener('error', (error) => {
      console.log('error', error);
    })
  }

  

}
