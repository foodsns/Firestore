// eslint-disable-next-line no-unused-vars
const assert = require('assert')
const firebase = require('@firebase/testing')
require('dotenv').config()

const MY_PROJECT_ID = 'mogutsou'
// eslint-disable-next-line no-undef
const EMULATE_HOST = process.env.FIRESTORE_EMULATOR_HOST

const myId = "user_abc"
const theirId = "user_xyz"

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

// eslint-disable-next-line no-undef
before (async () => {
    await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID })
})

describe("Test posts collection", () => {
    it("Can read only visible content", async () => {
        const postID = "post_abc"
        const setQuery = getFirestore(null, true).collection("posts").doc(postID)
        await setQuery.set({authorId: theirId, visibility: "public"})
        const postABC = getFirestore().collection("posts").doc(postID)
        await firebase.assertSucceeds(postABC.get())
    })

    it("Can't read private content", async () => {
        const postID = "post_def"
        const setQuery = getFirestore(null, true).collection("posts").doc(postID)
        await setQuery.set({authorId: theirId, visibility: "private"})
        const postABC = getFirestore().collection("posts").doc(postID)
        await firebase.assertFails(postABC.get())
    })

    it("Can read my content [theirId]", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}
        myAuth.uid = theirId
        const listQuery = getFirestore(myAuth).collection("posts").where("authorId", "==", theirId)
        await firebase.assertSucceeds((await listQuery.get()).size === 2)
    })

    it("Can read my content [myId]", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}
        const postID = "post_ghi"
        const setQuery = getFirestore(null, true).collection("posts").doc(postID)
        await setQuery.set({authorId: myAuth.uid, visibility: "private"})
        const listQuery = getFirestore(myAuth).collection("posts").where("authorId", "==", myAuth.uid)
        await firebase.assertSucceeds((await listQuery.get()).size === 1)
    })

    it("Can read all public or my content", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}
        const listQuery = getFirestore(myAuth).collection("posts").where("authorId", "==", myAuth.uid).where("visibility", "==", "public")
        await firebase.assertSucceeds((await listQuery.get()).size === 2)
    })

    it("Can read all public who not logged in", async () => {
        const listQuery = getFirestore().collection("posts").where("visibility", "==", "public")
        // 왜 where 문을 쓰지 않고는 실행이 불가능 한거지?
        await firebase.assertSucceeds((await listQuery.get()).size === 1)
    })

    it("Can't make new content who not logged in", async () => {
        await firebase.assertFails(getFirestore().collection("posts").doc("post_jkl").set({visibility: "private"}))
    })

    it("Can't make new content with authorId != myId", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}
        await firebase.assertFails(getFirestore(myAuth).collection("posts").doc("post_mno").set({authorId: theirId, visibility: "private"}))
    })

    it("Can make new content who logged in", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}
        myAuth.uid = theirId
        await firebase.assertSucceeds(getFirestore(myAuth).collection("posts").doc("post_jkl").set({authorId: theirId, visibility: "private"}))
    })

    it("Can't edit content who not logged in", async () => {
        await firebase.assertFails(getFirestore().collection("posts").doc("post_jkl").set({hello: "hi"}))
    })

    it("Can't edit other content", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}
        await firebase.assertFails(getFirestore(myAuth).collection("posts").doc("post_jkl").set({authorId: myAuth.uid, visibility: "private", country: "seoul"}))
    })

    it("Can edit my content", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}
        await firebase.assertSucceeds(getFirestore(myAuth).collection("posts").doc("post_ghi").set({authorId: myAuth.uid, visibility: "public", country: "seoul"}))
    })

    it("Can't write unsupported key", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}
        await firebase.assertFails(getFirestore(myAuth).collection("posts").doc("post_pqr").set({authorId: myAuth.uid, hello: "adsf", hi: "asdf"}))
    })
})