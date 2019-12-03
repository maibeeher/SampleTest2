import { Component, OnInit, NgModuleFactoryLoader } from '@angular/core';
import { Contact } from './contact.model';
import { Http } from '@angular/http';
import { LocalStorageService } from '../localStorageService';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface IContact {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  owed: number;
}
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contacts: Array<IContact> = [];
  params: string;
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {
  }

  async ngOnInit() {
    this.contacts = await this.loadContacts();

  }

  async loadContacts() {
    let contacts = JSON.parse(localStorage.getItem('contacts'));
    if (contacts && contacts.length > 0) {
      // contacts = contacts;
    } else {
      contacts = await this.loadContactsFromJSON();
    }
    console.log('this.contacts from ngOnInit...', this.contacts);
    this.contacts = contacts;
    return contacts;
  }

  async loadContactsFromJSON() {
    const contacts = await this.http.get('assets/contacts.json').toPromise();
    return contacts.json();
  }
  addContact() {
    const contact: IContact = {
      id: null,
      firstName: null,
      lastName: null,
      email: null,
      phone: null,
      owed: null
    };
    this.contacts.unshift(contact);
    this.saveToLocalStorage();
  }

  deleteContact(index: number) {
    this.contacts.splice(index, 1);
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  finalize() {
    console.log('from finalize.....');
    const data = this.calculate();
    localStorage.setItem('calculatedData', JSON.stringify(data));
    this.router.navigate(['home', data]);
  }
  calculate() {
    let owed = 0;
    for (let i = 0; i < this.contacts.length; i++) {
      // console.log('i --->', i, "this.contacts[i]", this.contacts[i]);
      owed += this.contacts[i].owed;
      // console.log('owed----->', owed);
    }
    return {
      numberOfContacts: this.contacts.length,
      subTotal: owed,
      taxAmount: owed * .10,
      total: owed + (owed * .10)
    };

  }
  search(params: string) {
    this.contacts = this.contacts.filter((contact: IContact) => {
      return contact.firstName.toLowerCase() === params.toLowerCase();
    });

  }

}
