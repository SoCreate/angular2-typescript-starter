/// <reference path="../typings/tsd.d.ts" />
import {Component, View, bootstrap, Inject} from 'angular2/angular2';
import {httpInjectables, Http} from 'angular2/angular2';
import {routerInjectables} from 'angular2/router';

@Component({
  selector: 'app'
})
@View({
  template: 'Angular2-Typescript-Starter'
})
class AppComponent {
  constructor( @Inject(Http) http: Http) {
    http.get('people.json').observer({
      next: (value) => console.log(value.json())
    });
  }
}
bootstrap(AppComponent, [routerInjectables, httpInjectables]);