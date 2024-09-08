import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({providedIn: "root"})
export class GifsService {

  private _tagsHistory: string[] = [];
  private apiKey: string = 'TpLQYwiQLQM9XbKFWjodcqwKX5ko9qur';
  private serviceUrl: string = 'http://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
  }

  get tagHistory(): string[] {
    return [...this._tagsHistory];
  }

  private organizaHistory(tag: string) {
    tag = tag.toLowerCase();
    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldtag) => oldtag !== tag);
    }
    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0, 10);
  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizaHistory(tag);
    console.log(this._tagsHistory)

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', 10)
      .set('q', tag);


    this.http.get(`${this.serviceUrl}/search`, { params })
      .subscribe( resp => {
        console.log(resp)
      });
    /*fetch('http://api.giphy.com/v1/gifs/trending?api_key=TpLQYwiQLQM9XbKFWjodcqwKX5ko9qur&q=valorant&limit=10')
      .then(resp => resp.json() )
      .then(data => console.log(data));*/
  }
}
