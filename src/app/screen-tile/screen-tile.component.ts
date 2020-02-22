import { Component, OnInit, Input } from "@angular/core";
import { saveAs } from "file-saver";
import { VideoService } from "../video.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-screen-tile",
  templateUrl: "./screen-tile.component.html",
  styleUrls: ["./screen-tile.component.css"]
})
export class ScreenTileComponent implements OnInit {
  @Input()
  histories: [{}];
  getVideoSub;
  page: number = 0;

  constructor(private videoService: VideoService) {}

  ngOnInit(): void {}

  downloadFile(download) {
    if (download.file_location === "NULL") {
      return;
    }
    this.getVideoSub = this.videoService
      .getVideo(`${environment.apiUrl}/jobs/file/${download.file_location}`)
      .subscribe(res => {
        saveAs(res, `${download.file_location}.mp4`);
        this.getVideoSub.unsubscribe();
      });
  }

  pagination(state) {
    switch (state) {
      case "PREVIOUS":
        this.page <= 0 ? (this.page = 0) : this.page--;
        break;
      case "NEXT":
        this.page += 1;
        break;

      default:
        break;
    }
    this.videoService
      .getDoneJobs(`${environment.apiUrl}/jobs/`, { page: this.page, take: 10 })
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.histories = res.payload;
        }
      });
  }
}
