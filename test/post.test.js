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
        await firebase.assertFails(getFirestore().collection("posts").doc("post_jkl").set(
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
                authorId: null,
                country: 'Korea', 
                city: '서울특별시',
                state: '중구',
                street: '정동',
                hashtag: '러시아공사관'
            }))
    })

    it("Can't make new content with authorId != myId", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}
        await firebase.assertFails(getFirestore(myAuth).collection("posts").doc("post_mno").set(
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
            }))
    })

    it("Can make new content who logged in", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}
        myAuth.uid = theirId
        await firebase.assertSucceeds(getFirestore(myAuth).collection("posts").doc("post_jkl").set(
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
            }))
    })

    it("Can't edit content who not logged in", async () => {
        await firebase.assertFails(getFirestore().collection("posts").doc("post_jkl").set(
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
            }))
    })

    it("Can't edit other content", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}
        await firebase.assertFails(getFirestore(myAuth).collection("posts").doc("post_jkl").set(
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
                authorId: myAuth.uid,
                country: 'Korea', 
                city: '서울특별시',
                state: '중구',
                street: '정동',
                hashtag: '러시아공사관'
            }))
    })

    it("Can edit my content", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}
        await firebase.assertSucceeds(getFirestore(myAuth).collection("posts").doc("post_ghi").set(
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
                visibility: "public",
                authorId: myAuth.uid,
                country: 'Korea', 
                city: '서울특별시',
                state: '중구',
                street: '정동',
                hashtag: '러시아공사관'
            }))
    })

    it("Can't write with unsupported key", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}
        await firebase.assertFails(getFirestore(myAuth).collection("posts").doc("post_pqr").set(
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
                visibility: "public",
                authorId: myAuth.uid,
                country: 'Korea', 
                city: '서울특별시',
                state: '중구',
                street: '정동',
                hashtag: '러시아공사관',
                hello: "adsf"
            }))
    })
})