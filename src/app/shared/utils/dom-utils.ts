import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DomUtils {
  static getFocusableElements(container?: HTMLElement): NodeListOf<HTMLElement> | undefined {
    const focusableSelectors = `
      a[href],
      button:not([disabled]),
      textarea:not([disabled]),
      input:not([disabled]),
      select:not([disabled]),
      [tabindex]:not([tabindex="-1"])
    `;

    return container?.querySelectorAll<HTMLElement>(focusableSelectors);
  }

  static getFirstFocusableElement(container: HTMLElement | undefined) {
    return this.getFocusableElements(container)?.[0];
  }
}
