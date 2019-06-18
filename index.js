const functions = require('firebase-functions');
const admin = require('firebase-admin');
const VERSION = "1.0.0";

admin.initializeApp();

const firestore = admin.firestore();
/**
 * Test firebase-functions that write to firestore.
 * 
 */
exports.firestore_test = functions.https.onRequest(async (request, response) => {

    console.log("run firestore_test function");

    const {id, val, writefs} = request.query;
    const data = {id, val, VERSION};

    if (writefs){
        try{
            await firestore.collection("fbfn-credentials-test").doc(id).set(data);
        }
        catch(err){
            console.error("Function error writing to firestore:", err);
            response.status(200).send({bingo:true});
            return;
        }
    }
    console.log("return ok echo data:", data);
    // all ok?, echo data
    response.status(200).send(data);

});