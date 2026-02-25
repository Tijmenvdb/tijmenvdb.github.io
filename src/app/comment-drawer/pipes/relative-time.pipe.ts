import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Pipe({
  name: 'relativeTime',
  pure: false
})
export class RelativeTimePipe implements PipeTransform {
  private timer: Subscription | null = null;

  constructor(private ref: ChangeDetectorRef) {
    this.timer = interval(60000).subscribe(() => {
      this.ref.markForCheck();
    });
  }

  transform(value: Date | string | number | undefined): string {
    if(!value) {
      return 'Unknown Date'
    }

    return this.formatRelativeTime(new Date(value));
  }

  ngOnDestroy(): void {
    if (this.timer) {
      this.timer.unsubscribe();
      this.timer = null;
    }
  }

  private formatRelativeTime(date: Date): string {
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) {
      return 'just now';
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }

    if (days < 30) {
      const weeks = Math.floor(days / 7);
      return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    }

    if (days < 365) {
      const months = Math.floor(days / 30);
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    }

    const years = Math.floor(days / 365);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }

}
