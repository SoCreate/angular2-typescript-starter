import {Component, View, bootstrap, Inject, bind} from 'angular2/angular2';
import {httpInjectables, Http} from 'angular2/angular2';
import {routerInjectables, appBaseHrefToken} from 'angular2/router';
import {formInjectables} from 'angular2/angular2';

@Component({
  selector: 'app'
})
@View({
  template: `Angular2-Typescript-Starter`
})
class AppComponent {
}
bootstrap(AppComponent, 
  [
    bind(appBaseHrefToken).toValue('/'),
    routerInjectables, 
    httpInjectables, 
    formInjectables
  ]);