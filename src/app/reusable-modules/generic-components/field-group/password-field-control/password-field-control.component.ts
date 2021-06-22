import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from 'src/app/models/field';

@Component({
  selector: 'app-password-field-control',
  templateUrl: './password-field-control.component.html',
  styleUrls: ['./password-field-control.component.scss'],
})
export class PasswordFieldControlComponent implements OnInit {
  @Input('formGroup') formGroup: FormGroup;
  @Input('field') field: Field;
  
  constructor() { }

  ngOnInit() {}

}
