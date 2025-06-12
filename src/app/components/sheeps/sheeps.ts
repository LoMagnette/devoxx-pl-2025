import {Component, computed, effect, inject, linkedSignal, signal, viewChildren} from '@angular/core';
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
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCard, MatCardContent} from '@angular/material/card';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatSnackBar} from '@angular/material/snack-bar';

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
    MatCard,
    MatCardContent,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    FormsModule,
  ],
  template: `
    <div class="tools">
      {{this.sheeps.status()}}
      <button mat-icon-button (click)="refreshSheep()" matTooltip="Reload sheep"><mat-icon>refresh</mat-icon>
      </button>
    </div>
    <div class="search-bar">
      <mat-form-field appearance="outline">
        <mat-label>Filter</mat-label>
        <input type="text" matInput ="filter" placeholder="Enter the name of the sheep you'r looking for" [(ngModel)]="searchText"/>
      </mat-form-field>
    </div>
    <div class="content">
      <div class="sheep-grid">
        @for(sheep of filteredSheeps(); track sheep.id){
          <app-sheep-card [sheep]="sheep" [(likes)]="likes"/>
        } @empty {
          <mat-card>
            <mat-card-content>
              No sheep found.
            </mat-card-content>
          </mat-card>
        }
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
  sheeps = this.sheepService.getSheep();
  filteredSheeps = linkedSignal( () =>
    this.sheeps.value()?.filter( s => s.name.toUpperCase().includes(this.searchText().toUpperCase()))
  )
  dialog = inject(MatDialog);
  searchText = signal('');
  snackBar = inject(MatSnackBar);
  likes = signal(0);

  cards = viewChildren(SheepCard);

  constructor() {
    effect(() => {
      this.onLikeChanged(this.likes());
    });
  }


  refreshSheep() {
    this.sheeps.reload();
  }

  addASheep() {
    const dialogRef = this.dialog.open(SheepDialog, {
      width: '400px',
      panelClass: 'space-theme-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.filteredSheeps.update( sheeps => [...sheeps || [], result]);
      }
    });
  }

  onLikeChanged(likes: number) {
    if(likes > 0) {
      this.snackBar.open(`A sheep has been liked ${likes} times with ${this.cards().length} cards!`);
    }
  }
}
