import { Injectable } from '@angular/core';
import { a } from '@angular/core/src/render3';

@Injectable()
export class SmarttagService {
  constructor() { }
  private arrayname: string[] = ['Test', 'Testing', 'Tester', 'Coder', 'Development'];
  tagArray: string[] = [];
  getSmartTagList(data) {
    this.tagArray = [];
    this.isExist(data);
    console.log(this.tagArray);
    return this.tagArray;
  }
  isExist(key) {
    for (let i = 0; i < this.arrayname.length; i++) {
      const index = this.arrayname[i].toLocaleLowerCase().includes(key);
      if (index) {
        this.tagArray.push(this.arrayname[i]);
      }
    }
  }
}
