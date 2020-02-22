import { Component, OnInit } from "@angular/core";
import { VideoService } from "../video.service";
import { NgForm } from "@angular/forms";
import io from "socket.io-client";
import { environment } from "src/environments/environment";
import { saveAs } from "file-saver";

@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.css"]
})
export class LandingPageComponent implements OnInit {
  videoData: any = <any>{};
  progress: number = 0;
  fileLocation: string;
  downloaded: boolean = false;
  jobId: number;
  connected: boolean = false;
  socket;
  getVideoSub;
  barWidth: number = 80;
  downloadHistory: [{}];

  constructor(private videoService: VideoService) {}

  ngOnInit() {
    this.addConnectionHandlers();
    this.getCompleteJobs();
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
          if (msg.progress >= 100) {
            this.downloadHistory.push(msg);
          }
          return;
        }
        this.progress = msg.progress;
        if (msg.progress == 100) {
          this.progress = 0;
          this.getCompleteJobs();
        }
      });
      this.socket.on("video_done", msg => {
        if (this.jobId != msg.jobId || this.downloaded) {
          return;
        }
        this.getVideoSub = this.downloadVideo(msg.fileLocation);
      });
    });
  }

  addVideoToQueue(videoForm: NgForm) {
    var valid = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/;
    this.videoData.url = this.videoData.url.trim();
    if (!valid.test(this.videoData.url)) {
      alert(`Invalid URL ${this.videoData.url}`);
      return;
    }

    this.videoService.addVideoToQueue(this.videoData).subscribe(
      (res: any) => {
        console.log(res);
        if (res.payload.file_location) {
          return this.downloadVideo(res.payload.file_location);
        }
        this.jobId = (res as any).payload.id;
      },
      err => {
        alert("Invalid URL");
      }
    );
  }

  getCompleteJobs() {
    this.videoService
      .getDoneJobs(`${environment.apiUrl}/jobs/`, {})
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.downloadHistory = res.payload;
        }
      });
  }

  downloadVideo(fileLocation: string) {
    return this.videoService
      .getVideo(`${environment.apiUrl}/jobs/file/${fileLocation}`)
      .subscribe(res => {
        if (!this.downloaded) {
          saveAs(res, `${fileLocation}.mp4`);
          this.progress = 0;
          this.downloaded = true;
          this.getVideoSub.unsubscribe();
        }
      });
  }
}
