// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  VERSION: require('../../package.json').version,
  moxurl: 'http://localhost:420/',
  firebaseConfig: {
    apiKey: 'AIzaSyCPEWNi0dsB5_rkYZzFXNgNePdlgZFLiKo',
    authDomain: 'mox-mtg.firebaseapp.com',
    databaseURL: 'https://mox-mtg.firebaseio.com',
    projectId: 'mox-mtg',
    storageBucket: 'mox-mtg.appspot.com',
    messagingSenderId: '483320339910'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.