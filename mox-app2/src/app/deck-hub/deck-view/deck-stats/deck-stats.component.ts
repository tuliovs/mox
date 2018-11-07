import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-mox-deck-stats',
  templateUrl: './deck-stats.component.html',
  styleUrls: ['./deck-stats.component.sass']
})
export class DeckStatsComponent implements OnInit, AfterViewInit {
  public object = Object;
  @Input() deckStats;
  public formOptions;
  public _ChartSelection: string;
  public pieChartData = {
    chartType: 'PieChart',
    dataTable: [ ],
    options: {
      'is3D': true,
      'width': 320,
      'height': 200,
      backgroundColor: '#132030',
      fontName: 'Exo 2',
      chartArea: {
        left: 0,
        top: 45,
        width: '100%',
        height: '70%'
      },
      colors: [
        '#f9ffff',
        '#888C8C',
        '#AFC0DC',
        '#667A95',
        '#9DAABB',
        '#101b28',
        '#435269',
      ],
      pieSliceTextStyle: {
        color: '#132030',
      },
      legend: {
        position: 'labeled',
        textStyle: { color: '#f9ffff', fontName: 'Exo 2', bold: true }
      },
      tooltip: {
        textStyle: {color: '#132030', fontName: 'Exo 2'},
        showColorCode: true
      },
      slices: {
        2: {offset: 0.2},
        4: {offset: 0.3},
        6: {offset: 0.4},
        0: {offset: 0.5},
      },
    },
  };
  constructor(
    public _formbuilder: FormBuilder,
    public _deckService: MoxDeckService,
    public _router: Router,
  ) { }

  ngOnInit() {
    if (this.deckStats) {
      const data = [
        ['Types', 'N in deck'],
        ['Lands', this.deckStats.typeLineData[0]],
        ['Creatures', this.deckStats.typeLineData[1]],
        ['Instants', this.deckStats.typeLineData[2]],
        ['Sorcerys', this.deckStats.typeLineData[3]],
        ['Artifacts', this.deckStats.typeLineData[4]],
        ['Enchantments', this.deckStats.typeLineData[5]],
        ['Planeswalker', this.deckStats.typeLineData[6]]
      ];
      this._ChartSelection = 'cardtypes';
      this.pieChartData.dataTable = data;
      this.formOptions = this._formbuilder.group({
        color: 'warn',
        chartSelection: this._ChartSelection,
      });
    }
  }

  ngAfterViewInit() {
  }

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

}
