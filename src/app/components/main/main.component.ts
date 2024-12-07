import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FormComponent } from '../form/form.component';
import { GraphComponent } from '../graph/graph.component';
import { ResultTableComponent } from '../result-table/result-table.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    HeaderComponent,
    FormComponent,
    GraphComponent,
    ResultTableComponent,
    FooterComponent
  ],
  template: `
    <app-header></app-header>
    <div class="content">
      <app-form></app-form>
      <app-graph></app-graph>
    </div>
    <app-result-table></app-result-table>
    <app-footer></app-footer>
  `
})
export class MainComponent {}
