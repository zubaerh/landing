import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit{
  numberOfPages = 5;
  currentpage = 1;
  pageOptions: number[]= [];

  constructor(){
    this.pageOptions = [
      this.currentpage - 2,
      this.currentpage - 1,
      this.currentpage,
      this.currentpage + 1,
      this.currentpage + 2,
    ].filter(pageNumber => pageNumber >=1 && pageNumber <= this.numberOfPages);
  }
  ngOnInit(): void {
    
  }

}
