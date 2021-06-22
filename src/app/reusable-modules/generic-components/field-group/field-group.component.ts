import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from 'src/app/models/field';
import { FoundationService } from 'src/app/services/foundation.service';

@Component({
  selector: 'app-field-group',
  templateUrl: './field-group.component.html',
  styleUrls: ['./field-group.component.scss'],
})
export class FieldGroupComponent implements OnInit {
  @Input('fields') fields: Field[];
  @Output('formGroupObj') formGroupObj = new EventEmitter<FormGroup>();

  formGroup: FormGroup;

  constructor(private foundationService: FoundationService) {
  }

  ngOnInit() {
    this.formGroup = this.foundationService.fieldsToFormGroup(this.fields);
    this.formGroupObj.emit(this.formGroup);
  }

}
