/// <reference path="../typings/angular2/angular2.d.ts" />
/// <reference path="../typings/angular2/router.d.ts" />
import {Component, View, bootstrap} from 'angular2/angular2';
import {routerInjectables} from 'angular2/router';
@Component({
  selector: 'app'
})
@View({
  template: 'Angular2-Typescript-Starter'
})
class AppComponent {
}
bootstrap(AppComponent, [routerInjectables]);