import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-editmodal',
  templateUrl: './editmodal.component.html',
  styleUrls: ['./editmodal.component.css']
})
export class EditmodalComponent implements OnInit {
  editForm!: FormGroup;
@Input() product:any
  constructor(private activeModal: NgbActiveModal,private fb: FormBuilder, ) { }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      productName: ['', Validators.required],
      productDescription: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      stockQuantity: [null, [Validators.required, Validators.min(1)]],
      id:['',Validators.required]
    });
    this.editForm.patchValue(this.product)
  }
  public dismiss() {
    console.log(this.editForm)
    this.activeModal.dismiss();
  }

  onSubmitEdit(){
    this.activeModal.close(this.editForm.value)
  }
}
