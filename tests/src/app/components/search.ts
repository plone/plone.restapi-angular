import { Component, OnInit } from '@angular/core';
import { Services, Vocabulary } from '@plone/restapi-angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.html',
})
export class Search implements OnInit {

  typesVocabulary: Vocabulary<string>;

  constructor(protected services: Services) {
  }

  ngOnInit() {

    this.services.resource.vocabulary('plone.app.vocabularies.ReallyUserFriendlyTypes')
      .subscribe((typesVocabulary: Vocabulary<string>) => {
        this.typesVocabulary = typesVocabulary;
      });
  }

  search(form) {
    let searchString = `/@@search?SearchableText=${form.value.text}`;
    if (form.value.type) {
      searchString += `&portal_type=${form.value.type}`;
    }
    this.services.traverser.traverse(searchString);
  }

}
