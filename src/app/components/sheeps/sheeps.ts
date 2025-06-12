import {Component, inject} from '@angular/core';
import {SheepCard} from '../sheep-card/sheep-card';
import {Observable} from 'rxjs';
import {Sheep} from '../../models/sheep';
import {SheepService} from '../../services/sheep-service';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {MatFabButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {MatDialog} from '@angular/material/dialog';
import {SheepDialog} from '../sheep-dialog/sheep-dialog';

@Component({
  selector: 'app-sheeps',
  imports: [
    SheepCard,
    NgForOf,
    AsyncPipe,
    MatIconButton,
    MatIcon,
    MatTooltip,
    MatFabButton,
  ],
  template: `
    <div class="tools">
      <button mat-icon-button (click)="refreshSheep()" matTooltip="Reload sheep">
        <mat-icon>refresh</mat-icon>
      </button>
    </div>
    <div class="content">
      <div class="sheep-grid">
        <ng-container *ngFor="let sheep of sheep$ | async">
          <app-sheep-card [sheep]="sheep"/>
        </ng-container>
      </div>
    </div>
      <div class="add">
        <button matFab (click)="addASheep()">
          <mat-icon>add</mat-icon>
        </button>
      </div>
  `,
  styleUrl: './sheeps.scss'
})
export class Sheeps {

  sheepService = inject<SheepService>(SheepService);
  sheep$: Observable<Sheep[]> = this.sheepService.getSheep();
  dialog = inject(MatDialog);


  refreshSheep() {
    this.sheep$ = this.sheepService.getSheep();
  }

  addASheep() {
    const dialogRef = this.dialog.open(SheepDialog, {
      width: '400px',
      panelClass: 'space-theme-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //TODO
      }
    });
  }
}
