import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { filter, switchMap, tap } from 'rxjs';

import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit{

  //Es una manera complementaria para poder utilizar las regiones creadas en el service en el componente
  // public regions: string[] = this.countriesService.regions;

  public myForm: FormGroup = this.fb.group({
    region: [ '', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required]
  })

  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = []

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) {}

  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChanged();
  }

  get regions(): Region[]{
    return this.countriesService.regions;
  }

  onRegionChanged(): void {
    this.myForm.get('region')!.valueChanges
    .pipe(
      tap( () => this.myForm.get('country')!.setValue('') ),
      tap( () => this.borders = []),
      switchMap( region => this.countriesService.getCountriesByRegion(region) )
    )
    .subscribe( countries => {
      this.countriesByRegion = countries;
      this.ordenarArray();
    })
  }

  onCountryChanged(): void {
    this.myForm.get('country')!.valueChanges
    .pipe(
      tap( () => this.myForm.get('border')!.setValue('') ),
      filter( (value:string) => value.length > 0),
      switchMap( alphaCode => this.countriesService.getCountryByAlphaCode(alphaCode) ),
      switchMap( country => this.countriesService.getCountryBordersByCodes( country.borders ) )
    )
    .subscribe( countries => {
      this.borders = countries;
    })
  }

  ordenarArray(): void {
    this.countriesByRegion.sort(function (a, b) {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }
}
