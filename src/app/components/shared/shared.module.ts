import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MenubarModule } from 'primeng/menubar';
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ToolbarModule,
    TableModule
  ],
  exports: [
    CommonModule,
    ToolbarModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputNumberModule,
    InputTextModule,
    InputTextareaModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule,
    KeyFilterModule,
    TagModule,
    DropdownModule,
    ReactiveFormsModule,
    MenubarModule,
    StepsModule,
    CardModule,
    AccordionModule
  ]
})
export class SharedModule { }
