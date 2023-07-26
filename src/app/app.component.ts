import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditmodalComponent } from './editmodal/editmodal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  productForm!: FormGroup;
error:any=[];
  products:any;
  apiUrl: string = 'http://localhost:3000/api/v1'
  isModalOpen: boolean = false;

  constructor(private fb: FormBuilder, protected http: HttpClient,
    private modalService: NgbModal,
    ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      products: this.fb.array([]),
    });
    this.getProduct()
 
  }

  getProduct() {
    this.get('product').subscribe(response => {
      this.products=response
    })
  }
  get formControl() {
    return this.productForm.controls;
  }
  get productsControl() {
    return this.formControl['products'] as FormArray;
  }
  get productArray(): FormArray {
    return this.productForm.get('products') as FormArray;
  }

  addProduct(): void {
    this.productArray.push(this.createProductFormGroup());
    this.error.push({})
  }

  createProductFormGroup(): FormGroup {
    return this.fb.group({
      productName: ['', Validators.required],
      productDescription: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      stockQuantity: [null, [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit(): void {
   this.post('product/bulk',{products:this.productArray.value}).subscribe((response)=>{
    if(!response.error){
      this.getProduct()
      this.productsControl.clear()
      this.error=[]
    }
   },(errors)=>{
    errors.error.forEach((err:any)=>{
      this.error[err.index]=err.fields
      console.log(this.error)
    })
   })
  }


  removeArray(i:any){
    this.productArray.removeAt(i)
    this.error.splice(i,1)
  }


  deleteProduct(i: any) {
    this.delete(`product/${this.products[i].id}`).subscribe(response=>{
      this.getProduct()
    })
  }

  editProduct(i: any) {
    const modalRef = this.modalService.open(EditmodalComponent, {
      size: 'sm',
      windowClass: 'refundClass',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.product = this.products[i];
    modalRef.result.then((response) => {
      this.put(`/product/${response.id}`,response).subscribe(response=>{
        this.getProduct();

      })
    });
  }


  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // Add any additional headers here if required
    });
  }

  private handleError(errorResponse: HttpErrorResponse) {
    return throwError(errorResponse.error);
  }


  post(endpoint: string, data: any): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}`;
    // const headers = this.getHeaders();
    // return this.http.post(url, data, { headers }).pipe(catchError(this.handleError));
    return this.http.post(url,data).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  // Function to handle GET request
  get(endpoint: string): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.get(url).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  // Function to handle PUT request
  put(endpoint: string, data: any): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}`;
    const headers = this.getHeaders();
    return this.http.put(url, data, { headers }).pipe(catchError(this.handleError));
  }

  // Function to handle DELETE request
  delete(endpoint: string): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}`;
    const headers = this.getHeaders();
    return this.http.delete(url, { headers }).pipe(catchError(this.handleError));
  }
}
