import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Directive, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { DomUtils } from '../../utils/dom-utils';

@Component({
  selector: 'app-drawer',
  imports: [CommonModule],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss'
})
export class DrawerComponent implements OnChanges {

  @HostListener('document:keydown', ['$event'])
  keydownEvent: Function = () => {};

  @ViewChild('drawer') drawer!: ElementRef<HTMLElement>;

  @Input()
  behavior: 'push' | 'overlay' | 'fullscreen' = 'push';

  @Input()
  position: 'left' | 'right' | 'top' | 'bottom' = 'bottom';

  @Input()
  isOpen: boolean = false;

  @Input()
  ariaLabel?: string;

  @Input()
  ariaLabelledby?: string;

  @Input()
  targetEntryElement?: HTMLElement | null;

  @Input()
  targetReturnElement?: HTMLElement | null;

  @Output()
  toggle: EventEmitter<boolean> = new EventEmitter();

  @Input()
  focusableElement?: HTMLElement | null;

  previouslyFocusedElement?: HTMLElement;

  @Input()
  returnElement?: HTMLElement | null

  roles: Record<string, string> = {
    'push' : 'complementary',
    'overlay' : 'dialog',
    'fullscreen' : 'main'
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes?.['isOpen'] && changes?.['isOpen'].currentValue != changes?.['isOpen'].previousValue && changes?.['isOpen'].currentValue) {
      this.previouslyFocusedElement = document.activeElement as HTMLElement;
      const entryElement = this.targetEntryElement? this.targetEntryElement : DomUtils.getFirstFocusableElement(this.drawer.nativeElement);

      setTimeout(() => entryElement?.focus({ preventScroll: true }));

      if(this.behavior == 'overlay') {
        this.keydownEvent = this.focusTrap;
      }
    }

    if(changes?.['isOpen'] && changes?.['isOpen'].currentValue != changes?.['isOpen'].previousValue && !changes?.['isOpen'].currentValue) {
      const returnElement = this.targetReturnElement? this.targetReturnElement : this.previouslyFocusedElement;

      setTimeout(() => returnElement?.focus({ preventScroll: true }));
      this.keydownEvent = () => {};
    }
  }

  toggleDrawer(isOpen: boolean): void {
    this.isOpen = isOpen;
    this.toggle.emit(isOpen);
  }

  disableMain(): boolean {
    return this.isOpen && this.behavior !== 'push';
  }

  focusTrap(event: KeyboardEvent) {
    const focusableElements = DomUtils.getFocusableElements(this.drawer.nativeElement);
    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements?.length - 1];
    const activeElement = document.activeElement as HTMLElement;
    
    if (event.key == 'Tab') {
      if (event.shiftKey && firstElement === activeElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if(!event.shiftKey && lastElement === activeElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }

    if(event.key == 'Escape') {
      this.toggleDrawer(false);
    }
  }
}
