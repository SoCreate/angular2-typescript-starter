import {Component, View, bootstrap, bind} from 'angular2/angular2';
import {HTTP_BINDINGS} from 'angular2/http';
import {ROUTER_BINDINGS, APP_BASE_HREF} from 'angular2/router';
import {FORM_BINDINGS} from 'angular2/angular2';

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
    bind(APP_BASE_HREF).toValue('/'),
    ROUTER_BINDINGS, 
    HTTP_BINDINGS, 
    FORM_BINDINGS
  ]);