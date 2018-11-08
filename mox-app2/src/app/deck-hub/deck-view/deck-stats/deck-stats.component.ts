import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { TYPE_SUMARY_ICONS, TYPE_SUMARY_TOOLTIP } from '@application/_constraints/ICON_LISTS';


@Component({
  selector: 'app-mox-deck-stats',
  templateUrl: './deck-stats.component.html',
  styleUrls: ['./deck-stats.component.sass']
})
export class DeckStatsComponent implements OnInit, AfterViewInit {
  public object = Object;
  @Input() deckStats;
  public typeIcons = TYPE_SUMARY_ICONS;
  public typeTooltips = TYPE_SUMARY_TOOLTIP;
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
        '#CCD1D1',
        '#888C8C',
        '#A0AFC8',
        '#667A95',
        '#9DAABB',
        '#BDCBE2'
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
        0: {offset: 0.1},
        2: {offset: 0.2},
        4: {offset: 0.3},
        6: {offset: 0.4},
        8: {offset: 0.5},
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
        color: 'accent',
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
