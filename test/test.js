const assert = require('assert')
const firebase = require('@firebase/testing')

const MY_PROJECT_ID = 'mogutsou'
const myId = "user_abc"
const theirId = "user_xyz"
const myAuth = {uid: myId, email: 'abc@example.com'}

function getFirebase(auth) {
    return firebase.initializeTestApp({
        projectId: MY_PROJECT_ID,
        auth
    }).firestore()
}

function getFirestore(auth) {
    const db = getFirebase(auth)
    db.settings({
        host: "localhost:8081",
        ssl: false
    });
    return db;
}

describe("Our social app", () => {
    it("Understands basic addtion", () => {
        assert.equal(2 + 2, 4)
    })

    it ("Can read items in the read-only collection", async () => {
        const testDoc = getFirestore().collection("readonly").doc("testDoc")
        await firebase.assertSucceeds(testDoc.get());
    })

    it ("Can't write to items in the read-only collection", async () => {
        const testDoc = getFirestore().collection("readonly").doc("testDoc")
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    })

    it ("Can write to a user document with the same ID as our user", async () => {
        const testDoc = getFirestore(myAuth).collection("users").doc("user_abc")
        await firebase.assertSucceeds(testDoc.set({foo: "bar"}))
    })

    it ("Can't write to a user document with a different ID as our user", async () => {
        myAuth.uid = theirId
        const testDoc = getFirestore(myAuth).collection("users").doc("user_xyz")
        await firebase.assertFails(testDoc.set({foo: "bar"}))
    })
})