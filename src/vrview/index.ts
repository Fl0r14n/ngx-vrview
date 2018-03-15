import {AfterViewInit, Component, ElementRef, Input, NgModule, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import 'vrview';

export interface Scene {
  [key: string]: {
    image?: string;
    video?: string;
    hotspots: Hotspot
  }
}

export interface Hotspot {
  [key: string]: {
    pitch: number;
    yaw: number;
    radius: number,
    distance: number
  }
}

declare let VRView: any;

export interface VRPlayerOptions {
  /**
   * URL to a 360° video file or an adaptive streaming manifest file (.mpd or .m3u8). Exactly one of video or image is required.
   */
  video?: string
  /**
   * URL to a 360° image file. Exactly one of video or image is required.
   */
  image?: string
  /**
   * String value for the iframe's width attribute.
   */
  width?: string
  /**
   * String value for the iframe's height attribute.
   */
  height?: string
  /**
   * (Optional) URL to a preview image for a 360° image file.
   */
  preview?: string
  /**
   * (Optional) Indicates whether the content at the image or video URL is stereo or not.
   */
  is_stereo?: boolean
  /**
   * (Optional) When true, turns on debug features like rendering hotspots ad showing the FPS meter.
   */
  is_debug?: boolean
  /**
   * (Optional) When true, disables the VR mode button.
   */
  is_vr_off?: boolean
  /**
   * (Optional) When true, disables the autopan introduction on desktop.
   */
  is_autopan_off?: boolean
  /**
   * (Optional) Numeric angle in degrees of the initial heading for the 360° content.
   * By default, the camera points at the center of the underlying image.
   */
  default_yaw?: number
  /**
   * (Optional) When true, prevents roll and pitch. This is intended for stereo panoramas.
   */
  is_yaw_only?: boolean
  /**
   * (Optional) When false, stops the loop in the video.
   */
  loop?: boolean
  /**
   * (Optional) When true, the fullscreen button contained inside the VR View iframe will be hidden.
   * This parameter is useful if the user wants to use VR View's fullscreen workflow (via vrView.setFullscreen() callback)
   * with an element outside the iframe.
   */
  hide_fullscreen_button?: boolean
  /**
   * (Optional) The initial volume of the media; it ranges between 0 and 1; zero equals muted.
   */
  volume?: number
  /**
   * (Optional) When true, mutes the sound of the video.
   */
  muted?: boolean
}

@Component({
  selector: 'vr-view',
  template: `
    <div id="vrview" #viewer></div>
  `
})
export class VRViewComponent implements AfterViewInit {

  @Input()
  scenes: Scene;
  @Input()
  width: number;
  @Input()
  height: number;

  @ViewChild('viewer')
  element: ElementRef;
  private player: any;

  constructor() {

  }

  ngAfterViewInit(): void {
    this.player = new VRView.Player(`#${this.element.nativeElement.id}`, {
      image: 'public/BarcelonaGreenLineMetro.jpg',
      width: this.width,
      height: this.height
    });
    this.player.on('ready', () => {
      this.loadScene(this.getFirstScene());
      this.player.on('click', (event) => event.id ? this.loadScene(event.id) : '');
    });
  }
  loadScene(id) {
    if (id) {
      // Set the image
      this.player.setContent({
        image: this.scenes[id].image,
        //preview: this.scenes[id].preview,
      });
      // Add all the hotspots for the scene
      let newScene = this.scenes[id];
      let sceneHotspots = Object.keys(newScene.hotspots);
      for (let i = 0; i < sceneHotspots.length; i++) {
        let hotspotKey = sceneHotspots[i];
        let hotspot = newScene.hotspots[hotspotKey];

        this.player.addHotspot(hotspotKey, {
          pitch: hotspot.pitch,
          yaw: hotspot.yaw,
          radius: hotspot.radius,
          distance: hotspot.distance
        });
      }
    }
  }

  getFirstScene() {
    for (let key in this.scenes) {
      if (this.scenes.hasOwnProperty(key)) {
        return key;
      }
    }
    return 0;
  }
}

@NgModule({
  imports: [
    CommonModule,

  ],
  declarations: [
    VRViewComponent
  ],
  exports: [
    VRViewComponent
  ]
})
export class VRViewModule {
}
