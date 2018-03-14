import {Component} from '@angular/core';
import {Scene} from '../../vrview';

@Component({
  selector: 'demo-1',
  providers: [],
  templateUrl: 'demo1.html',
  styleUrls: ['demo1.scss']
})
export class Demo1 {

  scenes: Scene = {
    world: {
      image: 'assets/1.jpg',
      hotspots: {
        green_area: {
          pitch: 10,
          yaw: -15,
          radius: 0.05,
          distance: 1
        },
      }
    },
    green_area: {
      image: 'assets/2.jpg',
      hotspots: {
        world: {
          pitch: 20,
          yaw: 0,
          radius: 0.05,
          distance: 1
        },
      }
    }
  };
}
