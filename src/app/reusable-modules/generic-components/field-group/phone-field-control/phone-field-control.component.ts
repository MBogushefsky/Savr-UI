import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from 'src/app/models/field';

@Component({
  selector: 'app-phone-field-control',
  templateUrl: './phone-field-control.component.html',
  styleUrls: ['./phone-field-control.component.scss'],
})
export class PhoneFieldControlComponent implements OnInit {
  @Input('formGroup') formGroup: FormGroup;
  @Input('field') field: Field;
  
  constructor() { }

  ngOnInit() {}

}
