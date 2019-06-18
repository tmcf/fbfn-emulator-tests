const functions = require('firebase-functions');
const admin = require('firebase-admin');
const VERSION = "1.0.0";

admin.initializeApp();

console.log(`process.env.GOOGLE_APPLICATION_CREDENTIALS=${JSON.stringify(process.env.GOOGLE_APPLICATION_CREDENTIALS)}`)

exports.firestore_test = functions.https.onRequest(async (request, response) => {

    // Allow parameters from body or query for easier testing
    const {id, val, write_fstore} = {...request.body, ...request.query};
    const data = {id, val, write_fstore, VERSION};

    console.log("firestore_test data:", JSON.stringify(data));
        try{
            if (write_fstore){
                await admin.firestore().collection("fbfn-credentials-test").doc(id).set(data);
            }
            response.status(200).send(data);
        }
        catch(err){
            console.log(`Error with request:${JSON.stringify(data)}`);
            console.error(err);
            response.status(500).send({data, err:err.message});
        }
});