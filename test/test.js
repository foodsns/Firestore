const assert = require('assert')
const firebase = require('@firebase/testing')

const MY_PROJECT_ID = 'mogutsou'

const db = firebase.initializeTestApp({
    projectId: MY_PROJECT_ID,
}).firestore()
db.settings({
    host: "localhost:8081",
    ssl: false
});

describe("Our social app", () => {
    it("Understands basic addtion", () => {
        assert.equal(2 + 2, 4)
    })

    it ("Can read items in the read-only collection", async () => {
        const testDoc = db.collection("readonly").doc("testDoc")
        await firebase.assertSucceeds(testDoc.get());
    })

    it ("Can't write to items in the read-only collection", async () => {
        const testDoc = db.collection("readonly").doc("testDoc")
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    })

    it ("Can write to a user document with the same ID as our user", async () => {
        const myAuth = {uid: 'user_abc', email: 'abc@example.com'}
        const dbAuth = firebase.initializeTestApp({
            projectId: MY_PROJECT_ID,
            auth: myAuth
        }).firestore()
        dbAuth.settings({
            host: "localhost:8081",
            ssl: false
        });
        const testDoc = dbAuth.collection("users").doc("user_abc")
        await firebase.assertSucceeds(testDoc.set({foo: "bar"}))
    })

    it ("Can't write to a user document with a different ID as our user", async () => {
        const myAuth = {uid: 'user_abc', email: 'abc@example.com'}
        const dbAuth = firebase.initializeTestApp({
            projectId: MY_PROJECT_ID,
            auth: myAuth
        }).firestore()
        dbAuth.settings({
            host: "localhost:8081",
            ssl: false
        });
        const testDoc = dbAuth.collection("users").doc("user_xyz")
        await firebase.assertFails(testDoc.set({foo: "bar"}))
    })
})