import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  query: string;
  page = 1;

  content: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private data: DataService,
    private rest: RestApiService,
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.query = res['query'];//get search query from activatedRoute
      this.page = 1;//set page # to 1
      this.getProducts();
    });
  }

  get lower() {
    return 1 + this.content.hitsPerPage * this.content.page;
  }

  get upper() {
    return Math.min(
      this.content.hitsPerPage * (this.content.page + 1),
      this.content.nbHits,
    );
  }

  async getProducts() {
    this.content = null;//clear search contents when search is executed
    try {
      const data = await this.rest.get(//retrieve search results
        `http://localhost:3030/api/search?query=${this.query}&page=${this.page -
          1}`,
      );
      data['success']//response is assigned to data
        ? (this.content = data['content'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }
}
