import { Component } from '@angular/core';

import { GlobalNavigation, Breadcrumbs } from '../lib';
import { ViewView } from '../lib';

@Component({
  selector: 'custom-breadcrumbs',
  templateUrl: './breadcrumbs.html'
})
export class CustomBreadcrumbs extends Breadcrumbs {}

@Component({
  selector: 'custom-navigation',
  templateUrl: './navigation.html'
})
export class CustomGlobalNavigation extends GlobalNavigation { }

@Component({
  selector: 'custom-view',
  templateUrl: './view.html'
})
export class CustomViewView extends ViewView {
  mode: 'view' | 'edit' = 'view';

  changeMode(mode: 'view' | 'edit') {
    this.mode = mode;
  }

  public downloadFile(event: Event) {
    event.preventDefault();
    const file = this.context.file;
    this.services.api.download(file.download)
      .subscribe((blob: Blob) => {
        this.saveDownloaded(blob, file.filename, file['content-type']);
      });
  }

  public saveDownloaded(blob: Blob, filename: string, contentType: string) {
    const a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(
      blob, <ObjectURLOptions>{ type: contentType }
    );
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

}
