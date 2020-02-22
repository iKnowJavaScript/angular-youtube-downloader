import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class VideoService {
  constructor(private http: HttpClient) {}

  addVideoToQueue(data) {
    return this.http.post<Blob>(`${environment.apiUrl}/jobs/new`, data);
  }

  getVideo(videoUrl: string) {
    return this.http.get<Blob>(videoUrl, {
      headers: new HttpHeaders({
        accept: "application/octet-stream",
        "content-type": "application/json"
      }),
      responseType: "blob" as "json"
    });
  }

  getDoneJobs(
    videoUrl: string,
    { page = 0, take = 10 }: { page?: number; take?: number }
  ) {
    return this.http.get(`${videoUrl}DONE?page=${page}&take${take}`, {
      headers: new HttpHeaders({
        accept: "application/json",
        "content-type": "application/json"
      })
    });
  }
}
