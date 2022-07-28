import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open') toggle: boolean = false;

  constructor() { }

  @HostListener('click') mouseClick() {
    this.toggle = !this.toggle;
  }

}
