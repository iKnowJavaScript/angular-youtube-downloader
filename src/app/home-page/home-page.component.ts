import { Component, OnInit } from "@angular/core";
import { VideoService } from "../video.service";
import { NgForm } from "@angular/forms";
import io from "socket.io-client";
import { environment } from "src/environments/environment";
import { saveAs } from "file-saver";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"]
})
export class HomePageComponent implements OnInit {
  videoData: any = <any>{};
  progress: number = 0;
  fileLocation: string;
  downloaded: boolean = false;
  jobId: number;
  connected: boolean = false;
  socket;
  getVideoSub;

  constructor(private videoService: VideoService) {}

  ngOnInit() {
    this.addConnectionHandlers();
  }

  addConnectionHandlers() {
    const manager = io.Manager(environment.socketIoUrl);
    manager.on("connect_error", () => {
      this.socket = io.connect(environment.socketIoUrl);
    });
    this.socket = io.connect(environment.socketIoUrl);
    this.socket.on("connect", data => {
      this.socket.on("connected", msg => {});
      this.socket.on("progress", msg => {
        if (this.jobId != msg.jobId) {
          return;
        }
        this.progress = msg.progress;
        if (msg.progress == 100) {
          this.progress = 0;
        }
      });
      this.socket.on("videoDone", msg => {
        if (this.jobId != msg.jobId || this.downloaded) {
          return;
        }
        this.getVideoSub = this.videoService
          .getVideo(`${environment.apiUrl}/jobs/file/${msg.fileLocation}`)
          .subscribe(res => {
            if (!this.downloaded) {
              saveAs(res, `${msg.fileLocation}.mp4`);
              this.progress = 0;
              this.downloaded = true;
              this.getVideoSub.unsubscribe();
            }
          });
      });
    });
  }

  addVideoToQueue(videoForm: NgForm) {
    this.downloaded = false;
    if (videoForm.invalid) {
      return;
    }
    this.videoService.addVideoToQueue(this.videoData).subscribe(
      res => {
        this.jobId = (res as any).payload.id;
      },
      err => {
        alert("Invalid URL");
      }
    );
  }
}
