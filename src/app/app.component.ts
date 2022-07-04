import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AddItems';
  vvvv = ""
  total = 0;
  itemArray : any[] = []
  closeResult: string = "";
  @ViewChild('content') someElement!: ElementRef 

  constructor(private modalService: NgbModal){}
  arrayItem :any[] = []
  ItemForm = new FormGroup({
    name: new FormControl(""),
    rate: new FormControl(0.0),
    description: new FormControl(""),
    qty: new FormControl(1),
    total: new FormControl(0.0),
  })

  form = new FormGroup({
    invoice_no : new FormControl(""),
    summary : new FormControl(""),
    customer : new FormControl(""),
    issue_Date : new FormControl(""),
    expiry_Date : new FormControl(""),
    billingAddress : new FormControl(""),
    shippingAddress : new FormControl(""),
    items : new FormArray([
      this.GetDocumentAndReturnFormGroup()
    ]),
    notes : new FormControl(""),
    TnC : new FormControl(""),
  })


  get getAllItems(){
    return this.form.controls.items as FormArray;
  }

  AddOrNotAdd(data:any , index:any){
    console.log(data);
    
    if(data.target.value === "add"){

      console.log(this.someElement);
      this.arrayItem.push(this.ItemForm)
      this.arrayItem.splice(parseInt(index) , parseInt(index)+1)
      this.getAllItems.removeAt(parseInt(index))
      this.modalService.open(this.someElement).result.then((result) => {
      let mn = this.ItemForm.controls.qty.value! * this.ItemForm.controls.rate.value!
      this.total = this.total + mn;
      // const ids = this.arrayItem.map(o => o.name)
      // const filtered = this.arrayItem.filter(({id}, index) => !ids.includes(id, index + 1))
      console.log("filtered value is",this.arrayItem);
      
      this.ItemForm.patchValue({
        'total':mn
      })
      this.getAllItems.push(this.ItemForm)
      this.arrayItem.push(this.ItemForm)
      console.log(this.arrayItem);
      
      let tempForm = new FormGroup({
        name: new FormControl(""),
        rate: new FormControl(0.0),
        description: new FormControl(""),
        qty: new FormControl(1),
        total: new FormControl(0.0),
      })
      this.ItemForm = tempForm;


        console.log("ARRAY VALUE ARE ", this.arrayItem);
        
        console.log("All items are ",this.getAllItems.value);
        console.log("All Item forms are ", this.ItemForm.value);
        
        this.closeResult = `Closed with: ${result}`;
        console.log(this.closeResult);
        
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        console.log(this.closeResult);
        
      });
    }
  
    else{
      let mmn : number = -1;
      let bn : any[] = this.getAllItems.value
      for (let index = 0; index < bn.length; index++) {
        const element = bn[index];
        if(element.name === data.target.value){
          mmn = index;
          break;
        }
        // this.AddNewEmptyItems()
      }
      const ids = this.arrayItem.map(o => o.name)
      const filtered = this.arrayItem.filter(({id}, index) => !ids.includes(id, index + 1))
      console.log("filtered value is",filtered);
      if(mmn !=1){
        let {qty , rate , total}  = this.getAllItems.at(mmn).value
        this.getAllItems.at(index).value.qty = qty;
        this.getAllItems.at(index).value.rate = rate;
        this.getAllItems.at(index).value.total = total;
        this.total = this.total + total;
      }else{
        
      }
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  
  }

  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }


  AddNewEmptyItems(){
    console.log(this.getAllItems.length);
    this.getAllItems.push(this.GetDocumentAndReturnFormGroup())
    console.log(this.getAllItems.value);
    
  }

  AddDocumentAndReturnFormGroup(data:any){
    return new FormGroup({
      name: new FormControl(data.name),
      rate: new FormControl(data.rate),
      description: new FormControl(data.description),
      qty: new FormControl(data.qty),
      total: new FormControl(data.total),
    })
  }

  GetDocumentAndReturnFormGroup(){
    return new FormGroup({
      name: new FormControl(""),
      rate: new FormControl(0.0),
      description: new FormControl(""),
      qty: new FormControl(1),
      total: new FormControl(0.0),
    })
  }

  EditDocumentAndReturnFormGroup(data:any){
    this.getAllItems.at(data)
  }

  DeleteDocumentAndReturnFormGroup(data:any){
    console.log("DELTE");
    this.total = this.total - this.getAllItems.at(data).value.total
    let {name , qty , rate , description } = this.getAllItems.at(data).value
    this.getAllItems.removeAt(data)
    let innn = -1;
    for (let index = 0; index < this.arrayItem.length; index++) {
      const element = this.arrayItem[index];
      if(element.value.name === name){
        innn = index;
      }
    }
    if(innn != -1)   this.arrayItem.splice(innn , innn+1)
    
    // if(data!=0){
    //   console.log("IN DELETE");
      
    //   this.getAllItems.removeAt(data);
    // }
  }

  valueExistOrNot(data:any){
    if(this.getAllItems.at(data).value.name == ""){
      return true;
    }
    return false;
  }

  getAllExistingArrayValues(){
    let m = this.getAllItems;
    let p : any[] = [];
    for(let i=0;i<m.length;i++){
      // console.log(m.at(i).value.name);
      
      if(m.at(i).value.name != ""){
        p.push(m.at(i).value)
      }
    }
    // console.log(p);
    
    return p;
  }
}
