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

describe("Test goods collection which is post's subcollection", () => {
    it("Can set good mark to other post", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}
        const postID = "post_good_abc"
        const setQuery = getFirestore(null, true).collection("posts").doc(postID)
        await setQuery.set(
            {
                id: 'ae3f053e-e0d4-486b-af6e-3d6138d426f9',
                title: '구 러시아공사관',
                descript: '구 러시아공사관',
                date: '2021년 9월 4일',
                profileImg: 'https://avatars.githubusercontent.com/u/16532326?v=4',
                writer: 'stories2stories2stories2stories2stories2stories2stories2stories2stories2',
                good: 8,
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Former_Russia_legation_of_Korea_01.JPG/272px-Former_Russia_legation_of_Korea_01.JPG',
                lat: 37.568178,
                lot: 126.971474,
                visibility: "private",
                authorId: theirId,
                country: 'Korea', 
                city: '서울특별시',
                state: '중구',
                street: '정동',
                hashtag: '러시아공사관'
            })
        await firebase.assertSucceeds(getFirestore(myAuth).collection("posts").doc(postID).collection("goods").doc(myAuth.uid).set({
            setTime: firebase.firestore.FieldValue.serverTimestamp()
        }))
    })
    it("Can't set good mark to my post", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}
        const postID = "post_good_def"
        const setQuery = getFirestore(null, true).collection("posts").doc(postID)
        await setQuery.set(
            {
                id: 'ae3f053e-e0d4-486b-af6e-3d6138d426f9',
                title: '구 러시아공사관',
                descript: '구 러시아공사관',
                date: '2021년 9월 4일',
                profileImg: 'https://avatars.githubusercontent.com/u/16532326?v=4',
                writer: 'stories2stories2stories2stories2stories2stories2stories2stories2stories2',
                good: 8,
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Former_Russia_legation_of_Korea_01.JPG/272px-Former_Russia_legation_of_Korea_01.JPG',
                lat: 37.568178,
                lot: 126.971474,
                visibility: "private",
                authorId: myId,
                country: 'Korea', 
                city: '서울특별시',
                state: '중구',
                street: '정동',
                hashtag: '러시아공사관'
            })
        await firebase.assertFails(getFirestore(myAuth).collection("posts").doc(postID).collection("goods").doc(myAuth.uid).set({
            setTime: firebase.firestore.FieldValue.serverTimestamp()
        }))
    })
    it("Can't set good mark to my post who not logged in", async () => {
        const postID = "post_good_def"
        await firebase.assertFails(getFirestore().collection("posts").doc(postID).collection("goods").doc("anonymous").set({
            setTime: firebase.firestore.FieldValue.serverTimestamp()
        }))
    })
})