import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {

  name = '';
  result: any;

  constructor(private http: HttpClient) { }
  
  isFormInvalid(): boolean {
    const invalidCharacters = /[^a-zA-Z\s]/;
    const multipleSpaces = /\s{2,}/;
    return this.name.length < 3 || invalidCharacters.test(this.name) || multipleSpaces.test(this.name);
  }
  
  submitForm() {
    this.http.get(`https://api.agify.io/?name=${this.name}`).subscribe((response: any) => {
      const age = response.age;
      this.http.get(`https://api.nationalize.io/?name=${this.name}`).subscribe((response: any) => {
        const country1 = response.country[0]?.country_id ?? '';
        const country2 = response.country[1]?.country_id ?? '';
        const country = country1 !== '' && country2 !== '' ? `${country1} or ${country2}` : country1;
        this.http.get(`https://api.genderize.io/?name=${this.name}`).subscribe((response: any) => {
          const gender = response.gender;
          this.result = {
            name:this.name,
            age,
            country,
            gender
          };
        });
      });
    });
  }

  reset() {
    this.name = '';
    this.result = null;
  }

}
