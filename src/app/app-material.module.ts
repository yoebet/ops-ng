import { NgModule } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';
import { MAT_LUXON_DATE_ADAPTER_OPTIONS, provideLuxonDateAdapter } from '@angular/material-luxon-adapter';


@NgModule({
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    { provide: MAT_LUXON_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    provideLuxonDateAdapter({
      parse: {
        dateInput: 'yyyy-MM-dd'
      },
      display: {
        dateInput: 'yyyy-MM-dd',
        monthYearLabel: 'yyyy-MM',
        dateA11yLabel: 'DDDD',
        monthYearA11yLabel: 'MMMM yyyy'
      },
    }),
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2000, verticalPosition: 'top' } },
  ],
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatTooltipModule,
    MatCardModule,
    MatGridListModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatSliderModule
  ]
})
export class AppMaterialModule {
}
