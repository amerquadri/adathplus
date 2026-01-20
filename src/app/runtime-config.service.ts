import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RuntimeConfigService {
  private config: any = {};
  constructor(private http: HttpClient) {}

  load(): Promise<void> {
    // config.json is placed at the web root (public/config.json -> /config.json in built app)
    return this.http.get('/config.json').toPromise().then((cfg: any) => {
      this.config = cfg || {};
    }).catch((err) => {
      // swallow error and keep defaults
      console.warn('Could not load /config.json, using defaults', err);
      this.config = {};
    }).then(() => {});
  }

  get(key: string, fallback: any = null) {
    return (this.config && (this.config[key] !== undefined)) ? this.config[key] : fallback;
  }

  getAll() { return this.config || {}; }
}
