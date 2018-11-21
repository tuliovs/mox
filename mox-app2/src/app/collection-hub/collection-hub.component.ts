import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MoxCollectionService } from '@application/_services/mox-services/collection/mox-collection.service';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { tap } from 'rxjs/operators';
import { MoxCollection, CollectionProcess } from '@application/_models/_mox-models/MoxCollection';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { AuthService } from '@karn/_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mox-collection-hub',
  templateUrl: './collection-hub.component.html',
  styleUrls: ['./collection-hub.component.sass']
})
export class CollectionHubComponent implements OnInit, AfterViewInit {
  private fireStoreCollection: AngularFirestoreCollection;
  public _userColls: MoxCollection[];
  public _selectedColl: MoxCollection;
  public _folders: string[] = [];
  public _folderVis: boolean[] = [];
  public _typeSelected: any;
  public showLoader = false;
  constructor(
    public _collServ: MoxCollectionService,
    public _afs: AngularFirestore,
    public _auth: AuthService,
    public _router: Router,
    private _state: ActionStateService,
  ) { }

  ngOnInit() {
    this.showLoader = true;
    this._auth.getUser().subscribe(
      (u) => {
        if (u) {
          this.fireStoreCollection = this._afs.collection('user-collections', ref => ref.where('ownerId', '==', u.uid));
          this.fireStoreCollection.valueChanges().pipe(
          tap((docL) => {
            this._userColls = <MoxCollection[]>docL.sort((a, b) => {
              if (a.name < b.name) {
                return -1;
              } else if (a.name > b.name) {
                return 1;
              } else {
                return 0;
              }
            });
            this._folders = [];
            this.filteredCollList()
              .forEach( (coll) => {
                if (coll.folder && coll.folder !== '' && !this._folders.includes(coll.folder)) {
                  this._folders.push(coll.folder);
                }
              });
            this.showLoader = false;
            this._state.setState('nav');
          })).subscribe();
        }
      }
    );
  }

  ngAfterViewInit() {

  }

  viewColl() {
    navigator.vibrate([40]);
    this._router.navigateByUrl(`/collection/${this._selectedColl.key}`);
  }

  collSelected(coll: MoxCollection) {
    if (this._selectedColl === coll) {
      navigator.vibrate([30, 30]);
      this._selectedColl = null;
      this._state.setState('nav');
    } else {
      navigator.vibrate([30]);
      this._state.setState('loading');
      this._selectedColl = coll;
      this._collServ.edit(coll, this._collServ._collProcess)
      .then(() => {
        this._state.setState('nav');
      })
      .catch(() => {
        this._state.setState('error');
      });
    }
  }

  async newColl(event?: MoxCollection) {
    navigator.vibrate([30]);
    if (event) {
      const serv = this._collServ;
      serv.create(event)
      .then(p => serv.edit(p.collection, p))
      .then(e => serv.set(e))
      .then(
        (cp: CollectionProcess) => {
          console.log(cp);
        }
      )
      .catch(
        (err) => {
          console.error(err);
        }
      );
    } else {
      console.log('##');
    }
  }

  collFolderInclude(fparam) {
    const ser = this._collServ;
    ser._collProcess.collection.folder = fparam;
    ser.update(ser._collProcess);
  }

  collFolderRemove() {
    const ser = this._collServ;
    ser._collProcess.collection.folder = null;
    ser.update(ser._collProcess);
  }
  filteredCollList() {
    return (this._typeSelected) ? this._userColls.filter(x => x.type === this._typeSelected) : this._userColls;
  }

}
