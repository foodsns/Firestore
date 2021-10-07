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

describe("Test users collection", () => {
    it("Can write user_A data", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}
        await firebase.assertSucceeds(getFirestore(myAuth).collection("users").doc(myAuth.uid).set(
            {
                displayName: 'USER_A',
                email: 'USER_A@example.com',
                emailVerified: false,
                photoURL: 'https://avatars.githubusercontent.com/u/90189814?s=200&v=4',
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            }))
    })
    it("Can read user_A data", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}
        const userA = getFirestore(myAuth).collection("users").doc(myId)
        await firebase.assertSucceeds(userA.get())
    })
    it("Can write user_B data", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}
        myAuth.uid = theirId
        await firebase.assertSucceeds(getFirestore(myAuth).collection("users").doc(myAuth.uid).set(
            {
                displayName: 'USER_B',
                email: 'USER_B@example.com',
                emailVerified: false,
                photoURL: 'https://avatars.githubusercontent.com/u/90189814?s=200&v=4',
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            }))
    })
    it("Can read user_B data", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}
        myAuth.uid = theirId
        const userB = getFirestore(myAuth).collection("users").doc(theirId)
        await firebase.assertSucceeds(userB.get())
    })
    it("Can't read user_B data logged in as user_A", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}
        const userA = getFirestore(myAuth).collection("users").doc(theirId)
        await firebase.assertFails(userA.get())
    })
    it("Can't write user_B data logged in as user_A", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}
        await firebase.assertFails(getFirestore(myAuth).collection("users").doc(theirId).set(
            {
                displayName: 'USER_A',
                email: 'USER_A@example.com',
                emailVerified: false,
                photoURL: 'https://avatars.githubusercontent.com/u/90189814?s=200&v=4',
                lastLogin: new Date().getTime()
            }))
    })
    it("Can't write anonymous user data", async () => {
        await firebase.assertFails(getFirestore().collection("users").doc("anonymous").set(
            {
                displayName: 'USER_Anonymous',
                email: 'USER_Anonymous@example.com',
                emailVerified: false,
                photoURL: 'https://avatars.githubusercontent.com/u/90189814?s=200&v=4',
                lastLogin: new Date().getTime()
            }))
    })
})