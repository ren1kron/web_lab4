// import { Component } from '@angular/core';
// import { HeaderComponent } from './components/header/header.component';
// import { FormComponent } from './components/form/form.component';
// import { GraphComponent } from './components/graph/graph.component';
// import { ResultTableComponent } from './components/result-table/result-table.component';
// import { FooterComponent } from './components/footer/footer.component';
//
// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [
//     HeaderComponent,
//     FormComponent,
//     GraphComponent,
//     ResultTableComponent,
//     FooterComponent
//   ],
//   template: `
//     <app-header></app-header>
//     <div class="content">
//       <app-form></app-form>
//       <app-graph></app-graph>
//     </div>
//     <app-result-table></app-result-table>
//     <app-footer></app-footer>
//   `,
//   styles: []
// })
// export class AppComponent { }


import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {}
