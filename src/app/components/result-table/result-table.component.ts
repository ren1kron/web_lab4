import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-result-table',
    imports: [NgFor],
    templateUrl: './result-table.component.html',
    standalone: true,
    styleUrl: './result-table.component.scss'
})
export class ResultTableComponent {

}
