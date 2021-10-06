const assert = require('assert')
const firebase = require('@firebase/testing')
require('dotenv').config()

const MY_PROJECT_ID = 'mogutsou'
const EMULATE_HOST = "localhost:8081"

const myId = "user_abc"
const theirId = "user_xyz"
const myAuth = {uid: myId, email: 'abc@example.com'}

function getFirebase(auth) {
    return firebase.initializeTestApp({
        projectId: MY_PROJECT_ID,
        auth
    })
}

function getAdminFirebase(auth) {
    return firebase.initializeAdminApp({
        projectId: MY_PROJECT_ID,
        auth
    })
}

function getFirestore(auth, admin = false) {
    const db = (admin ? getAdminFirebase(auth) : getFirebase(auth)).firestore()
    db.settings({
        host: EMULATE_HOST,
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

    it ("Can read posts marked public", async () => {
        const testQuery = getFirestore().collection("posts").where("visibility", "==", "public");
        await firebase.assertSucceeds(testQuery.get());
    })

    it ("Can query personal posts", async () => {
        const testQuery = getFirestore(myAuth).collection("posts").where("authorId", "==", myId)
        await firebase.assertSucceeds(testQuery.get())
    })

    it ("Can't query all posts", async () => {
        const testQuery = getFirestore(myAuth).collection("posts");
        await firebase.assertFails(testQuery.get())
    })

    it ("Can read a single public post", async () => {
        const postID = "public_post"
        const setQuery = getFirestore(null, true).collection("posts").doc(postID)
        await setQuery.set({authorId: theirId, visibility: "public"})
        const testQuery = getFirestore().collection("posts").doc(postID)
        await firebase.assertSucceeds(testQuery.get())
    })

    it ("Can't read a single private post", async () => {
        const postID = "private_post"
        const setQuery = getFirestore(null, true).collection("posts").doc(postID)
        await setQuery.set({authorId: theirId, visibility: "private"})
        const testQuery = getFirestore(myAuth).collection("posts").doc(postID)
        await firebase.assertFails(testQuery.get())
    })
})

// eslint-disable-next-line no-undef
after (async () => {
    await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID })
})