## functions emulator vs functions shell differences connecting to project firestore

This issue concerns accessing the project's live firestore instance when testing local
firestore cloud functions. Case #3 below with `firebase emulators:start` is the one that fails.

(This is not about connecting to a local firestore emulator, that works ok if a Firestore
instance is created directly and the admin.firestore() is not used.)

See [firebase-tools/issue#1412](https://github.com/firebase/firebase-tools/issues/1412)

### 1. OK firebase deploy
Sanity check, make sure everything works when deployed.
```
firestore deploy
```
When functions are deployed, writes to the live project firestore work as expected.
Live deploy: https://fbfn-emulator-tests.firebaseapp.com/ 

### 2. OK firebase functions:shell 

Although the firebase docs made me think the emulators should have adequate credentials
to access firestore I could not get this to work.

If GOOGLE_APPLICATION_CREDENTIALS is not set the following error occurs when invoking function writing to firestore:
```
Could not load the default credentials. Browse to https://cloud.google.com/docs/authentication/getting-started for more information.
```
To run the https cloud function successfully:
```
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials
firebase functions:shell
firebase> firestore_test.get('?id=THX1138&val=HELLO&write_fstore=true')
RESPONSE RECEIVED FROM FUNCTION: 200, "{\"id\":\"THX1138\",\"val\":\"HELLO\",\"write_fstore\":\"true\",\"VERSION\":\"1.0.0\"}"
```
Goto firebase console / database and confirm document was written to fbfn-credentials-test

### 3. FAIL firebase emulators:start --only hosting,functions

```
firestore emulators:start --only hosting,functions
```
Goto local test URL in browser or command line:
```
curl 'http://localhost:5000/firestore_test?id=THX1138&val=hello&write_fstore=true'
```

With or Without GOOGLE_APPLICATION_CREDENTIALS set:
```
⚠  Unknown network resource requested!
   - URL: "http://metadata.google.internal./computeMetadata/v1/instance"
>  Error with request:{"id":"THX1138","val":"hello","write_fstore":"true","VERSION":"1.0.0"}
>  Error: Could not load the default credentials. Browse to https://cloud.google.com/docs/authentication/getting-started for more information.
>      at GoogleAuth.getApplicationDefaultAsync (/Users/tmcf/tdev/fbfn-emulator-tests/functions/node_modules/google-auth-library/build/src/auth/googleauth.js:161:19)
>      at process._tickCallback (internal/process/next_tick.js:68:7)
```

This is likely caused by the emulator explicitly setting GOOGLE_APPLICATION_CREDENTIALS to "" in functionsEmulatorRuntime.
https://github.com/firebase/firebase-tools/blob/589387b79a9c07f4811ab35201ced1bb84e66e72/src/emulator/functionsEmulatorRuntime.ts#L495

The comments indicate this is done purposefully to prevent accidental access of a production resource.


