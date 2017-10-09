import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { APIService } from '../api.service';
import { DownloadFailedEvent, DownloadStartedEvent, DownloadSucceededEvent, NamedFile, Error } from '../interfaces';


@Directive({
  selector: '[download]'
})
export class DownloadDirective {

  @Input() download: NamedFile;
  @Output() onBeforeDownloadStarted: EventEmitter<DownloadStartedEvent> = new EventEmitter();
  @Output() onDownloadSuccess: EventEmitter<DownloadSucceededEvent> = new EventEmitter();
  @Output() onDownloadFailed: EventEmitter<DownloadFailedEvent> = new EventEmitter();

  constructor(private api: APIService) {
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (!!event) {
      event.preventDefault();
    }
    const namedFile: NamedFile = this.download;
    this.onBeforeDownloadStarted.emit(<DownloadStartedEvent>{
      namedFile: namedFile,
      originalEvent: event
    });
    this.api.download(namedFile.download)
      .subscribe((blob: Blob | {}) => {
        if (blob instanceof Blob) {
          DownloadDirective.saveDownloaded(namedFile, blob);
          this.onDownloadSuccess.emit(<DownloadSucceededEvent>{
            namedFile: namedFile,
            blob: blob
          });
        }
      }, (error: Error) => {
        this.onDownloadFailed.emit(<DownloadFailedEvent>{
          error: error,
          namedFile: namedFile
        })
      })
  }

  private static saveDownloaded(namedFile: NamedFile, blob: Blob) {
    const a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(
      blob, <ObjectURLOptions>{ type: namedFile['mime-type'] }
    );
    a.download = namedFile.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
