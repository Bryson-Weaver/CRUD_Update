import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/service/crud.service';


@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})

export class AddBookComponent implements OnInit {
  bookForm: FormGroup;
  bookId: any = null;
  isEdit: boolean = false;
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private crudService: CrudService,
    private actRoute: ActivatedRoute
  ) {
      this.bookForm = this.formBuilder.group({
      isbn: [''],
      title: [''],
      author: [''],
      description: [''],
      published_year: [''],
      publisher: ['']
    })
  }
  ngOnInit(): void {
    // Check if we are in edit mode
    this.bookId = this.actRoute.snapshot.paramMap.get('id');
    if (this.bookId) {
      this.isEdit = true;
      this.crudService.GetBook(this.bookId).subscribe((res) => {
        // patch form with returned values
        this.bookForm.patchValue({
          isbn: res.isbn,
          title: res.title,
          author: res.author,
          description: res.description,
          published_year: res.published_year,
          publisher: res.publisher
        });
      }, (err) => console.log(err));
    }
  }

  onSubmit(): any {
    if (this.isEdit && this.bookId) {
      this.crudService.UpdateBook(this.bookId, this.bookForm.value)
      .subscribe({
        next: (res) => console.log('Updated', res),
        error: (err) => console.log(err),
      });
    } else {
      this.crudService.AddBook(this.bookForm.value)
      .subscribe({
        error: (err) => console.log(err),
      });
    }
    this.ngZone.run(() => this.router.navigateByUrl('/books-list'));
  }
}