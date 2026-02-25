import { Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommentSection } from '../models/comment.models';

@Pipe({
  name: 'sectionOrder'
})
export class SectionOrderPipe implements PipeTransform {

  transform(map: Map<string, BehaviorSubject<CommentSection>>): {sectionId: string, section$: BehaviorSubject<CommentSection>}[] {

    const sortedList = Array.from(map.entries())
    .filter(
      ([, section]) => !!section.value.comments.length
    ).sort(
      ([, a], [, b]) => a.value.order - b.value.order 
    ).map(
      ([id, section$]) => ({ sectionId: id, section$: section$ })
    );

    return sortedList;
  }

}
