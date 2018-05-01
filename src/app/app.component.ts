import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';

import * as tf from '@tensorflow/tfjs-core';
import {MobileNet} from '../lib/mobilenet';

interface FileReaderEventTarget extends EventTarget {
  result: string;
}

interface FileReaderEvent extends ProgressEvent {
  target: FileReaderEventTarget;
  getMessage(): string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  static VIDEO_PIXELS = 224;

  mn: MobileNet;
  isRunning: boolean;
  topClasses: {label: string, value: any}[];
  imageElement: HTMLImageElement;
  displayedColumns = ['label', 'value'];

  src = '/assets/cat.jpeg';

  constructor() {
    this.mn = new MobileNet();
  }

  async ngOnInit() {
    await this.mn.load();
    this.imageElement = document.getElementById('image') as HTMLImageElement;
    console.log('imageElement', this.imageElement);
    this.isRunning = true;
  }

  updateImage(event) {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();

    // var imgtag = document.getElementById("myimage");
    // imgtag.title = selectedFile.name;

    reader.onload = (ev: FileReaderEvent) => {
      // console.log(ev)
      this.src = ev.target.result;
    };

    reader.readAsDataURL(selectedFile);
  }

  async analyze() {
    if (this.isRunning) {

      const result = tf.tidy(() => {

        const pixels = tf.fromPixels(this.imageElement);
        const centerHeight = pixels.shape[0] / 2;
        const beginHeight = centerHeight - (AppComponent.VIDEO_PIXELS / 2);
        const centerWidth = pixels.shape[1] / 2;
        const beginWidth = centerWidth - (AppComponent.VIDEO_PIXELS / 2);
        // console.log({beginHeight,centerWidth,beginWidth});
        const pixelsCropped =
              pixels.slice([beginHeight, beginWidth, 0],
                           [AppComponent.VIDEO_PIXELS, AppComponent.VIDEO_PIXELS, 3]);

        return this.mn.predict(pixelsCropped);
      });

      // This call retrieves the topK matches from our MobileNet for the
      // provided image data.
      this.topClasses = await this.mn.getTopKClasses(result, 5);
      console.log('topClasses', this.topClasses);
    }
  }
}
