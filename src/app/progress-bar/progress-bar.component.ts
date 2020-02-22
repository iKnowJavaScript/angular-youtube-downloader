import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-progress-bar",
  templateUrl: "./progress-bar.component.html",
  styleUrls: ["./progress-bar.component.css"]
})
export class ProgressBarComponent implements OnInit {
  @Input()
  width: any;
  @Input()
  state: string;
  constructor() {}

  ngOnInit() {}

  toFixed(number: string, index = 2) {
    return Number(number).toFixed(index);
  }
}
