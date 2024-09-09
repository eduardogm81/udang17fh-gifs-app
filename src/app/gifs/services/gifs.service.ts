import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Gif, SearchResponse } from "../interfaces/gifs.interfaces";

@Injectable({providedIn: "root"})
export class GifsService {

  public gifList: Gif[]  = [];

  private _tagsHistory: string[] = [];
  private apiKey: string = 'TpLQYwiQLQM9XbKFWjodcqwKX5ko9qur';
  private serviceUrl: string = 'http://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
    this.searchFistTag();
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
    this.saveLocalStorage();
  }

  private searchFistTag() {
    if (this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);
  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizaHistory(tag);
    console.log(this._tagsHistory)

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', 10)
      .set('q', tag);


    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe( resp => {
        this.gifList = resp.data;
        console.log({gifs : this.gifList})
      });
    /*fetch('http://api.giphy.com/v1/gifs/trending?api_key=TpLQYwiQLQM9XbKFWjodcqwKX5ko9qur&q=valorant&limit=10')
      .then(resp => resp.json() )
      .then(data => console.log(data));*/
  }
}
