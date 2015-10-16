import {Component, View, bootstrap, provide} from 'angular2/angular2';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS, APP_BASE_HREF} from 'angular2/router';
import {FORM_PROVIDERS} from 'angular2/angular2';

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
    provide(APP_BASE_HREF, {useValue: '/'}),
    ROUTER_PROVIDERS, 
    HTTP_PROVIDERS, 
    FORM_PROVIDERS
  ]);