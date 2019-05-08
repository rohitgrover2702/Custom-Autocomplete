import { Component, OnInit, NgZone, Input, forwardRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SmarttagService } from './smarttag.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, ControlValueAccessor {
  @Input()
  placeholder;
  @Input()
  formControlName;
  @Input()
  name: string;
  // tslint:disable-next-line:no-any
  @Output() onTagUpdated: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line:no-any
  @Output() onItemRemoved: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line:no-any
  smartTagArray: any[] = [];
  charArray: string[] = [];
  arrowkeyLocation = 0;
  // tslint:disable-next-line:no-any
  range: any;
  // tslint:disable-next-line:no-any
  sel: any;
  // tslint:disable-next-line:no-any
  urlText: any;
  leftCusrsorPos = '';
  topCusrsorPos = '';
  displayPlaceholder = true;
  item: string[] = [];
  isArrayFilled = false;
  temp = '';

  onModelChange: Function = () => { };
  onModelTouched: Function = () => { };

  constructor(private smartTagService: SmarttagService, private zone: NgZone) { }

  ngOnInit() { }

  // tslint:disable-next-line:no-any
  writeValue(value: any): void {
    if (value !== null && value !== undefined && value !== '') {
      value.forEach(res => {
        this.setTaggeditem(res);
      });
    }
  }
  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }
  /** Key Press event for typing tags names */
  keyPress(e, editableDiv) {
    let keynum;
    if (window.event) {
      // IE
      keynum = e.keyCode;
    } else if (e.which) {
      // Netscape/Firefox/Opera
      keynum = e.which;
    }
    this.charArray.push(String.fromCharCode(keynum));
    if (this.charArray.length > 2) {
      this.getTagList(this.charArray);
    }
  }
  keyDown(event: KeyboardEvent, e) {
    if (e.innerText.length >= 1000 && event.keyCode !== (8 || 46)) {
      event.preventDefault();
    }
    switch (event.keyCode) {
      case 37: // this is the ascii of arrow up
        if (this.smartTagArray.length > 0) {
          event.preventDefault();
        }
        break;
      case 39: // this is the ascii of arrow up
        if (this.smartTagArray.length > 0) {
          event.preventDefault();
        }
        break;
      case 38: // this is the ascii of arrow up
        this.arrowkeyLocation--;
        event.preventDefault();
        break;
      case 40: // this is the ascii of arrow down
        this.arrowkeyLocation++;
        event.preventDefault();
        break;
      case 13: // this is the ascii of arrow down
        if (this.smartTagArray.length > 0) {
          event.preventDefault();
          this.setTaggeditem(this.smartTagArray[this.arrowkeyLocation]);
        } else if (this.charArray.length === 0) {
          event.preventDefault();
        } else {
          const orginalElem = document.getElementById('postDiv').innerText.split(' ');
          // tslint:disable-next-line:no-any
          let str = '';
          // Added by Rohit on 17 September
          const tempArraylength = this.temp.split('|'); // calculate length
          let splittedTemp = '';
          for (let i = 0; i < tempArraylength.length; i++) {
            const newTemp = tempArraylength[i].split(' ');
            for (let j = 0; j < newTemp.length; j++) {
              if (newTemp[j].length > 0) {
                splittedTemp += newTemp[j] + '|';
              }
            }
          }

          // const length = orginalElem.length;
          // str = orginalElem[length - 1];
          setTimeout(() => {
            for (let j = 0 + splittedTemp.split('|').length - 1; j < orginalElem.length; j++) {
              // Remove elements from array
              if (orginalElem[j].length > 0) {
                str += orginalElem[j] + ' ';
              }
            }
            this.setTaggeditem(str);
          }, 100);
        }
        break;
      case 46: // delete Key pressed
        const selectedElem = window.getSelection().toString();
        const domElem = document.getElementById('postDiv').innerText;
        // if (selectedElem === domElem) {
        this.smartTagArray = [];
        this.charArray = [];
        this.temp = '';
        //  }
        break;
    }
  }
  getCaretPosition(editableDiv, e) {
    if (editableDiv.innerHTML.trim().length > 0) {
      this.displayPlaceholder = false;
    } else {
      this.displayPlaceholder = true;
    }
    if (e.which === 8) {
      const elem = <HTMLElement>event.currentTarget;
      const children = elem.lastChild;
      const findString = <HTMLElement>children;
      if (findString !== null) {
        const inner = findString.innerHTML;
        if (inner !== undefined) {
          const isfind = inner.includes('&nbsp');
          if (isfind && this.charArray.length === 0) {
            findString.remove();
            // Update temp
            this.updateTempNew(findString.innerText);
            this.charArray = [];
            this.onTagUpdated.emit();
          }
        }
      }
      this.charArray.pop();
      this.smartTagArray = this.smartTagArray.length > 0 ? (this.smartTagArray = []) : this.smartTagArray;
      setTimeout(() => {
        document.getElementById('postDiv1').innerHTML = document.getElementById('postDiv').innerHTML;
      }, 600);
    }
    if (window.getSelection) {
      // IE9 and non-IE
      this.sel = window.getSelection();
      if (this.sel.getRangeAt && this.sel.rangeCount) {
        this.range = this.sel.getRangeAt(0);
        // const selectedText = this.range.extractContents();
        this.urlText = this.range;
        this.leftCusrsorPos = this.range.getBoundingClientRect().left - editableDiv.getBoundingClientRect().left + 'px';
        this.topCusrsorPos = this.range.getBoundingClientRect().top - editableDiv.getBoundingClientRect().top + 'px';
      }
    }
  }

  setTaggeditem(tag) {
    let html = '';
    // tslint:disable-next-line:no-any
    let elem: any;
    // html = '<div><span id="' + tag + '" class="taggedName"><span contenteditable="false">' + tag + '</span>';
    // html += '<i id="' + tag + '" class="fas fa-times tag-close"></i></span> &nbsp;</div>';
    tag = tag.trim();
    if (tag.length > 0) {
      html = '<div><span id="' + tag + '" class="taggedName" contenteditable="false">' + tag;
      html += '<i id="' + tag + '" class="fas fa-times tag-close"></i></span> &nbsp;</div>';
      const elements = document.getElementById('postDiv');
      const originalDvInnerText = elements.innerText;
      const originalDvInnerHtml = elements.innerHTML;
      elements.innerText = '';
      elem = document.getElementById('postDiv1');
      if (originalDvInnerHtml === originalDvInnerText) {
        elem.innerHTML = '';
        elem.innerText = '';
      } else {
        // elem.innerText += tag.trim() + '|';
        if (this.temp.length === 0) {
          this.temp += elem.innerText.split(' ')[0] + '|' + tag + '|';
        } else {
          this.temp += tag + '|';
        }
      }
      // const splittedText = elem.innerText.split(' ');
      const splittedText = this.temp.split('|');
      elem.innerHTML = '';
      for (let i = 0; i < splittedText.length - 1; i++) {
        let htmlNew = '';
        splittedText[i] = splittedText[i].trim();
        if (splittedText[i].length > 0) {
          htmlNew =
            '<div><span id="' + splittedText[i] + '" class="taggedName" contenteditable="false">' + splittedText[i];
          htmlNew += '<i id="' + splittedText[i] + '" class="fas fa-times tag-close"></i></span> &nbsp;</div>';
          elem.innerHTML += htmlNew;
        }
      }
      if (this.temp.length === 0) {
        elem.innerHTML = elem.innerHTML + html;
      } else {
        elem.innerHTML = elem.innerHTML;
      }
      elements.innerHTML = elem.innerHTML;
      // Add event listener
      setTimeout(() => {
        const children = document.getElementsByClassName('tag-close');
        for (let i = 0; i < children.length; i++) {
          children[i].addEventListener('click', (event: Event) => {
            this.removeTag(event);
          });
        }
      }, 500);

      const element = document.getElementById('postDiv');
      this.placeCaretAtEnd(element);
      this.onTagUpdated.emit();
      // set caret position
      this.charArray = [];
      this.smartTagArray = [];
      this.arrowkeyLocation = 0;
    }
  }
  removeTag(tagName) {
    tagName.currentTarget.parentElement.parentElement.remove(); // Remove Tag
    document.getElementById('postDiv1').innerHTML = document.getElementById('postDiv').innerHTML;
    // update temp variable
    this.updateTemp(tagName);
    this.charArray = [];
    this.smartTagArray = [];
    this.onTagUpdated.emit();
  }
  /** Update temp variable */
  updateTemp(tagName) {
    const arr = this.temp.split('|');
    this.temp = '';
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].trim() !== tagName.currentTarget.id && arr[i].trim().length > 0) {
        this.temp += arr[i].trim() + '|';
      }
    }
  }
  /** Update temp variable */
  updateTempNew(tagName) {
    const arr = this.temp.split('|');
    this.temp = '';
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].trim() !== tagName.trim() && arr[i].trim().length > 0) {
        this.temp += arr[i].trim() + '|';
      }
    }
  }
  /** Get tag List */
  getTagList(text) {
    const textValue = text;
    if (textValue.length <= 2 && textValue !== '') {
      return;
    } else if (textValue.length === 0) {
      return;
    } else {
      const requestVM = {
        TagName: this.charArray.join('')
      };
      this.smartTagArray = [];
      this.smartTagService.getSmartTagList(requestVM.TagName).map(response => {
        if (response) {
          this.smartTagArray.push(response);
          this.checkIfTagAlreadyExist();
          this.isArrayFilled = true;
        }
      });
    }
  }

  checkIfTagAlreadyExist() {
    // const tags = document.getElementById('postDiv');
    // const tagsArr = tags.innerText.split(' ');
    const tagsArr = this.temp.split('|');
    for (let i = 0; i < tagsArr.length; i++) {
      if (tagsArr[i] !== '') {
        tagsArr[i] = tagsArr[i].trim();
      }
    }
    // const filtered = this.smartTagArray.filter(f => !tagsArr.includes(f));
    // this.smartTagArray = filtered;
    this.diff(this.smartTagArray, tagsArr);
  }
  diff = function (arr, arr2) {
    this.smartTagArray = [];
    for (let i = 0; i < arr.length; i++) {
      if (!arr2.includes(arr[i])) {
        this.smartTagArray.push(arr[i]);
      }
    }
  };

  placeCaretAtEnd(el) {
    el.focus();
    const x = el.innerHTML.replace(/<br>/g, '');
    el.innerHTML = x;
    if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
      // const range = document.createRange();
      this.sel = window.getSelection();
      this.range = this.sel.getRangeAt(0);
      this.range.selectNodeContents(el);
      this.range.collapse(false);
      this.sel.removeAllRanges();
      this.sel.addRange(this.range);
    }
  }
  getTags() {
    const elem = document.getElementById('postDiv');
    if (this.temp.length === 0 && elem.innerText.length > 0) {
      const elemArr1 = elem.innerText.split(' ');
      if (elemArr1.length <= 2) {
        this.temp = elemArr1[0].trim() + '|';
      } else {
        for (let i = 0; i < elemArr1.length; i++) {
          if (elemArr1[i] !== '' && elemArr1[i].trim().length > 0) {
            this.temp += ' ' + elemArr1[i].trim() + ' ';
          } else {
            if (i === elemArr1.length - 1) {
              this.temp += '|';
            }
          }
        }
      }
    }
    const elemArr = this.temp.split('|');
    let mergedTags = '';
    for (let i = 0; i < elemArr.length; i++) {
      if (elemArr[i] !== ' ' && elemArr[i] !== undefined && elemArr[i].trim().length !== 0) {
        elemArr[i] = elemArr[i].trim();
        mergedTags.length > 0 ? (mergedTags = mergedTags + ',' + elemArr[i]) : (mergedTags = elemArr[i]);
      }
    }
    return mergedTags;
  }
}
