import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'host-ui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'host-ui';
  users: any;
  constructor(private http: HttpClient) {
    
  }
  ngOnInit() {
    this.getAllUser();
  }
  

  getAllUser()
  {
    const url = 'https://localhost:7234/api/Users';
    return this.http.get(url).subscribe({
      next: (response) => this.users = response,
      error: (error) => console.log(error)
    });
  }

}
