import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilderComponent } from '../../form-builder/form-builder.component';
import { MatIcon } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DealTypeI, EntityFieldsService } from '../../services/entity-fields.service';
import { FormConfig, FormFieldConfig } from '../../form-builder/form-builder.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-deal-form',
  imports: [
    MatFormField, 
    MatSelectModule, 
    CommonModule, 
    FormBuilderComponent, 
    FormsModule,
    MatIcon
  ],
  templateUrl: './deal-form.component.html',
  styleUrl: './deal-form.component.scss'
})
export class DealFormComponent {

  @Input() companyInfo:any = null;
  @Input() dealFormValues:any = {id: null};
  @Output() onAfterSubmitDeal = new EventEmitter<any>();

  entityFieldsService = inject(EntityFieldsService);
  dataService = inject(DataService);

  selectedDealType = '';
  originalDealTypes: DealTypeI[] = [];
  dealTypes: DealTypeI[] = [];
  dealFormConfig: FormConfig = { fields: [] }

  ngOnInit() {

    this.entityFieldsService.getDealTypeOptions().subscribe((dealTypes) => {
      this.originalDealTypes = dealTypes;
      this.dealTypes = this.originalDealTypes.filter(dealType =>
          dealType.relations.some(relation => this.companyInfo.relations.includes(relation))
      );
    })

    if(this.dealFormValues.dealType){
    this.entityFieldsService.getDealFieldsForType(this.dealFormValues.dealType).subscribe((fields: FormFieldConfig[]) => {
      this.dealFormConfig = {
        title: '',
        icon: '',
        fields: fields,
        submitText: 'Update Deal'
      }
    })
    }



  }


  onSelectDealType(dealTypeId: string) {
    const deal: any = this.originalDealTypes.find(deal => deal.id === dealTypeId);
    this.entityFieldsService.getDealFieldsForType(dealTypeId).subscribe((fields: FormFieldConfig[]) => {
      this.dealFormConfig = {
        title: deal.label || '',
        icon: deal.icon || '',
        fields: fields,
        submitText: 'Add Deal'
      }
    })
  }

  submitDeal(formData:any){
    formData.id ? this.updateDeal(formData) : this.addNewDeal(formData)
  }


  addNewDeal(formData: any) {
    formData.dealType = this.selectedDealType;
    formData.dealTypeName = (this.dealTypes.find(dt => dt.id === formData.dealType))?.label;
    formData.notes = [];
    this.dataService.addDeal(this.companyInfo.id, formData).subscribe((response) => {
      this.onAfterSubmitDeal.emit(response);
    })
  }

  updateDeal(formData: any) {
    this.dataService.updateDeal(this.companyInfo.id, formData).subscribe((response) => {
      this.onAfterSubmitDeal.emit(response);
    })
  }

}
