import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Field } from 'src/app/models/field';

@Component({
  selector: 'app-text-field-control',
  templateUrl: './text-field-control.component.html',
  styleUrls: ['./text-field-control.component.scss'],
})
export class TextFieldControlComponent implements OnInit {
  @Input('formGroup') formGroup: FormGroup;
  @Input('field') field: Field;

  constructor() { }

  ngOnInit() {}

}
