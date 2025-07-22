import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { CommentElementType } from '../models/comment.models';
import { DomUtils } from '../../shared/utils/dom-utils';

@Injectable({
  providedIn: 'root'
})
export class CommentElementService implements OnDestroy {

  private main?: HTMLElement;
  private drawer?: HTMLElement;
  private header?: HTMLElement;

  private hooks = new Map<string, HTMLElement>();
  private sections = new Map<string, HTMLElement>();
  private comments = new Map<string, HTMLElement>();

  private activeHookId?: string;
  private activeCommentId?: string;

  public returnHook?: HTMLElement;

  private defocusHandler = (event: MouseEvent) => {};

  constructor() { }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.defocusHandler);
  }

  registerElement(type: CommentElementType, element: HTMLElement, id?: string): void {
    switch(type) {
      case 'main': {
        this.main = element;
        break;
      }
      case 'drawer': {
        this.drawer = element;
        break;
      }
      case 'header': {
        this.header = element;
        break;
      }
      case 'hook': {
        if(id) {
          this.hooks.set(id, element);
        }
        break;
      }
      case 'section': {
        if(id) {
          this.sections.set(id, element);
        }
        break;
      }
      case 'comment': {
        if(id) {
          this.comments.set(id, element);
        }
        break;
      }
    }
  }

  deregisterElement(type: CommentElementType, id?: string) {
    if(!id) {
      return;
    }

    switch(type) {
      case 'hook': {
        this.hooks.delete(id);
        break;
      }
      case 'section': {
        this.sections.delete(id);
        break;
      }
      case 'comment': {
        this.comments.delete(id);
        break;
      }
    }
  }

  private activeElement(sectionId: string, commentId: string): void {
    this.activeHookId = sectionId;
    this.activeCommentId = commentId;

    this.hooks.get(sectionId)?.classList.add('focus');
    this.comments.get(commentId)?.classList.add('focus');
  }

  private deactiveElement(): void {
    if(!this.activeCommentId || !this.activeHookId) {

      return;
    }

    this.hooks.get(this.activeHookId)?.classList.remove('focus');
    this.comments.get(this.activeCommentId)?.classList.remove('focus');
    this.activeHookId = undefined;
    this.activeCommentId = undefined;
  }

  focus(sectionId: string, commentId: string): void {
    const isListening = !!this.activeCommentId;

    if(this.activeCommentId == commentId) {
      return;
    }

    this.deactiveElement();
    this.activeElement(sectionId, commentId);

    if(isListening) {
      return;
    }

    this.defocusHandler = (event: MouseEvent) => {
      setTimeout(() => {
        if(!this.activeCommentId || !this.activeHookId) {
          document.removeEventListener('click', this.defocusHandler);
          return;
        }

        const currComment = this.comments.get(this.activeCommentId);
        const currHook = this.hooks.get(this.activeHookId);
        if (!currComment?.contains(event.target as Node) && !currComment?.contains(document.activeElement) && !currHook?.contains(document.activeElement)) {
          this.deactiveElement();
          document.removeEventListener('click', this.defocusHandler);
        }
      }, 1)
    }

    document.addEventListener('click', this.defocusHandler);
  }

  focusHook(sectionId: string, commentId: string) {
    this.hooks.get(sectionId)?.focus({preventScroll: true});
    this.focus(sectionId, commentId);
    this.scrollToHook(sectionId);
    this.scrollToSection(sectionId);
    this.returnHook = this.hooks.get(sectionId);
  }

  focusSection(sectionId: string, commentId: string) {
    DomUtils.getFirstFocusableElement(this.comments.get(commentId))?.focus({preventScroll: true});
    this.scrollToSection(sectionId);
    this.returnHook = this.hooks.get(sectionId);
  }

  focusComment(sectionId: string, commentId: string) {
    DomUtils.getFirstFocusableElement(this.comments.get(commentId))?.focus({preventScroll: true});
    this.scrollToComment(commentId);
    this.returnHook = this.hooks.get(sectionId);
  }

  private scrollToElement(element?: HTMLElement, container?: HTMLElement, offsetElement?: HTMLElement) {
    const style = getComputedStyle(offsetElement as Element);
    const marginTop = parseFloat(style.marginTop);
    const marginBottom = parseFloat(style.marginBottom);

    const offset = (offsetElement?.offsetHeight ?? 0) + marginTop + marginBottom;

    container?.scrollTo(
      {
        top: element? element.offsetTop - offset : 0
      }
    )
  }

  scrollToHook(sectionId: string) {
    const hook = this.hooks.get(sectionId);

    this.scrollToElement(hook, this.main, this.header);
  }

  scrollToComment(commentId: string) {
    const comment = this.comments.get(commentId);
    this.scrollToElement(comment, this.drawer, this.header);
  }

  scrollToSection(sectionId: string) {
    const section = this.sections.get(sectionId);
    this.scrollToElement(section, this.drawer, this.header);
  }
}
