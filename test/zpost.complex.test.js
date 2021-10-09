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

function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

describe("Test goods collection with complex query", () => {

    it("Should checked good mark which is already checked by me", async () => {
        await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID })

        const theirAuth = {uid: theirId, email: 'abc@example.com'}
        await firebase.assertSucceeds(getFirestore(theirAuth).collection("posts").doc(`post_dummy_1`).set(
            {
                id: '993915c4-878b-4486-b9a8-052971a9620d',
                title: '서울 시청',
                descript: '2012년에 세운 정부의 현대적인 명소로, 1925년에 지었으며 현재는 도서관이 된 옛 시청 건물 옆에 있습니다.',
                date: firebase.firestore.FieldValue.serverTimestamp(),
                profileImg: 'https://avatars.githubusercontent.com/u/16532326?v=4',
                writer: 'stories2stories2stories2stories2stories2stories2stories2stories2stories2',
                good: 0,
                img: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Seoul_City_Hall_20190608_001.jpg',
                lat: 37.566543,
                lot: 126.978421,
                visibility: "public",
                authorId: theirAuth.uid,
                country: 'Korea', 
                city: '서울특별시',
                state: '중구',
                street: '정동',
                hashtag: '러시아공사관'
            }))
        await firebase.assertSucceeds(getFirestore(theirAuth).collection("posts").doc(`post_dummy_2`).set(
            {
                id: '525d7948-d35a-4104-8cbb-ab70f0ced1d1',
                title: '덕수궁',
                descript: '서울의 심장부에 있는 유서 깊은 궁전으로 왕궁수문장 교대 의식을 볼 수 있습니다.',
                date: firebase.firestore.FieldValue.serverTimestamp(),
                profileImg: 'https://avatars.githubusercontent.com/u/16532326?v=4',
                writer: 'stories2stories2stories2stories2stories2stories2stories2stories2stories2',
                good: 0,
                img: 'https://www.heritage.go.kr/images/content/palaces/pd_pic01.jpg',
                lat: 37.565772,
                lot: 126.975160,
                visibility: "public",
                authorId: theirAuth.uid,
                country: 'Korea', 
                city: '서울특별시',
                state: '중구',
                street: '정동',
                hashtag: '러시아공사관'
            }))
        await firebase.assertSucceeds(getFirestore(theirAuth).collection("posts").doc(`post_dummy_3`).set(
            {
                id: '9758a109-3adc-4dc3-a50c-d25afa839e05',
                title: '시청역',
                descript: '서울 시청역',
                date: firebase.firestore.FieldValue.serverTimestamp(),
                profileImg: 'https://avatars.githubusercontent.com/u/16532326?v=4',
                writer: 'stories2stories2stories2stories2stories2stories2stories2stories2stories2',
                good: 0,
                img: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/%EC%8B%9C%EC%B2%AD%EC%97%AD_%EC%97%AD%EB%AA%85%ED%8C%90%282%ED%98%B8%EC%84%A0%29.JPG',
                lat: 37.565559,
                lot: 126.977173,
                visibility: "public",
                authorId: theirAuth.uid,
                country: 'Korea', 
                city: '서울특별시',
                state: '중구',
                street: '정동',
                hashtag: '러시아공사관'
            }))
        await firebase.assertSucceeds(getFirestore(theirAuth).collection("posts").doc(`post_dummy_4`).set(
            {
                id: '5895722f-f12a-4572-9260-888b5b3e2072',
                title: '미국대사관저',
                descript: '미국대사관저',
                date: firebase.firestore.FieldValue.serverTimestamp(),
                profileImg: 'https://avatars.githubusercontent.com/u/16532326?v=4',
                writer: 'stories2stories2stories2stories2stories2stories2stories2stories2stories2',
                good: 0,
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/USA_Embassy_Building_in_Seoul.jpg/270px-USA_Embassy_Building_in_Seoul.jpg',
                lat: 37.566940,
                lot: 126.972958,
                visibility: "public",
                authorId: theirAuth.uid,
                country: 'Korea', 
                city: '서울특별시',
                state: '중구',
                street: '정동',
                hashtag: '러시아공사관'
            }))
        await firebase.assertSucceeds(getFirestore(theirAuth).collection("posts").doc(`post_dummy_5`).set(
            {
                id: '9a9b35a1-d737-4c32-ad1d-0c9329bbd717',
                title: '동화면세점',
                descript: '동화면세점',
                date: firebase.firestore.FieldValue.serverTimestamp(),
                profileImg: 'https://avatars.githubusercontent.com/u/16532326?v=4',
                writer: 'stories2stories2stories2stories2stories2stories2stories2stories2stories2',
                good: 0,
                img: 'https://ir.dwdfs.com/images/sub/about-ceo-visual.jpg',
                lat: 37.569586,
                lot: 126.976187,
                visibility: "private",
                authorId: theirAuth.uid,
                country: 'Korea', 
                city: '서울특별시',
                state: '중구',
                street: '정동',
                hashtag: '러시아공사관'
            }))
        await firebase.assertSucceeds(getFirestore(theirAuth).collection("posts").doc(`post_dummy_6`).set(
            {
                id: '26ddb129-3643-4836-bd99-7c56e6f5fd91',
                title: '주한 콜롬비아 대사관',
                descript: '주한 콜롬비아 대사관',
                date: firebase.firestore.FieldValue.serverTimestamp(),
                profileImg: 'https://avatars.githubusercontent.com/u/16532326?v=4',
                writer: 'stories2stories2stories2stories2stories2stories2stories2stories2stories2',
                good: 0,
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Bogot%C3%A1_embajada_de_Corea_del_Sur.JPG/270px-Bogot%C3%A1_embajada_de_Corea_del_Sur.JPG',
                lat: 37.570936,
                lot: 126.977952,
                visibility: "private",
                authorId: theirAuth.uid,
                country: 'Korea', 
                city: '서울특별시',
                state: '중구',
                street: '정동',
                hashtag: '러시아공사관'
            }))
            
        const myAuth = {uid: myId, email: 'abc@example.com'}
        await firebase.assertSucceeds(getFirestore(myAuth).collection("posts").doc(`post_dummy_7`).set(
            {
                id: '83775fa5-97b0-4dde-92f5-7721d52de1eb',
                title: 'KT광화문지사',
                descript: 'KT광화문지사',
                date: firebase.firestore.FieldValue.serverTimestamp(),
                profileImg: 'https://avatars.githubusercontent.com/u/16532326?v=4',
                writer: 'stories2stories2stories2stories2stories2stories2stories2stories2stories2',
                good: 0,
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_South_Korea_on_building.jpg/300px-Flag_of_South_Korea_on_building.jpg',
                lat: 37.572008,
                lot: 126.977951,
                visibility: "private",
                authorId: myAuth.uid,
                country: 'Korea', 
                city: '서울특별시',
                state: '중구',
                street: '정동',
                hashtag: '러시아공사관'
            }))
        await firebase.assertSucceeds(getFirestore(myAuth).collection("posts").doc(`post_dummy_8`).set(
            {
                id: 'ae3f053e-e0d4-486b-af6e-3d6138d426f9',
                title: '구 러시아공사관',
                descript: '구 러시아공사관',
                date: firebase.firestore.FieldValue.serverTimestamp(),
                profileImg: 'https://avatars.githubusercontent.com/u/16532326?v=4',
                writer: 'stories2stories2stories2stories2stories2stories2stories2stories2stories2',
                good: 0,
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

        await firebase.assertSucceeds(getFirestore(myAuth).collection("posts").doc("post_dummy_1").collection("goods").doc(myAuth.uid).set({
            authorId: myAuth.uid,
            setTime: firebase.firestore.FieldValue.serverTimestamp()
        }))
        await firebase.assertSucceeds(getFirestore(myAuth).collection("posts").doc("post_dummy_2").collection("goods").doc(myAuth.uid).set({
            authorId: myAuth.uid,
            setTime: firebase.firestore.FieldValue.serverTimestamp()
        }))
        // 다른 사람쓴 게시물에 내가 좋아요를 표시 했지만 비활성화 되었다는 가정
        await firebase.assertSucceeds(getFirestore(myAuth, true).collection("posts").doc("post_dummy_6").collection("goods").doc(myAuth.uid).set({
            authorId: myAuth.uid,
            setTime: firebase.firestore.FieldValue.serverTimestamp()
        }))

        const [checkGoodMarkedAndPublicOtherPostList, checkGoodMarkedMyPostList] = await Promise.all([
            // 내가 쓴게 아니고 공개 게시물이고, 내가 좋아요를 표시했었는지
            Promise.all(await (await getFirestore(myAuth).collection("posts").where("authorId", "!=", myAuth.uid).where("visibility", "==", "public").get()).docs.map(async item => {
                return {
                    ...(await item.data()),
                    goodMarked: !await (await item.ref.collection("goods").where("authorId", "==", myAuth.uid).get()).empty
                }
            })),
            // 내가 썼지만 위의 데이터 포맷을 맞추기 위함
            Promise.all((await getFirestore(myAuth).collection("posts").where("authorId", "==", myAuth.uid).get()).docs.map(async item => {
                return {
                    ...(await item.data()),
                    goodMarked: false
                }
            }))
        ])

        firebase.assertSucceeds(checkGoodMarkedAndPublicOtherPostList.length === 4)
        firebase.assertSucceeds(checkGoodMarkedAndPublicOtherPostList.filter(item => item.goodMarked).length === 2)
        firebase.assertSucceeds(checkGoodMarkedMyPostList.length === 2)
    })

    it("Should checked good mark which is already checked by me [Performance test (Data gen)]", async () => {
        await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID })

        const theirAuth = {uid: theirId, email: 'abc@example.com'}
        await firebase.assertSucceeds(getFirestore(theirAuth).collection("posts").doc(`post_dummy_1`).set(
            {
                id: '993915c4-878b-4486-b9a8-052971a9620d',
                title: '서울 시청',
                descript: '2012년에 세운 정부의 현대적인 명소로, 1925년에 지었으며 현재는 도서관이 된 옛 시청 건물 옆에 있습니다.',
                date: firebase.firestore.FieldValue.serverTimestamp(),
                profileImg: 'https://avatars.githubusercontent.com/u/16532326?v=4',
                writer: 'stories2stories2stories2stories2stories2stories2stories2stories2stories2',
                good: 0,
                img: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Seoul_City_Hall_20190608_001.jpg',
                lat: 37.566543,
                lot: 126.978421,
                visibility: "public",
                authorId: theirAuth.uid,
                country: 'Korea', 
                city: '서울특별시',
                state: '중구',
                street: '정동',
                hashtag: '러시아공사관'
            }))
        await firebase.assertSucceeds(getFirestore(theirAuth).collection("posts").doc(`post_dummy_2`).set(
            {
                id: '525d7948-d35a-4104-8cbb-ab70f0ced1d1',
                title: '덕수궁',
                descript: '서울의 심장부에 있는 유서 깊은 궁전으로 왕궁수문장 교대 의식을 볼 수 있습니다.',
                date: firebase.firestore.FieldValue.serverTimestamp(),
                profileImg: 'https://avatars.githubusercontent.com/u/16532326?v=4',
                writer: 'stories2stories2stories2stories2stories2stories2stories2stories2stories2',
                good: 0,
                img: 'https://www.heritage.go.kr/images/content/palaces/pd_pic01.jpg',
                lat: 37.565772,
                lot: 126.975160,
                visibility: "public",
                authorId: theirAuth.uid,
                country: 'Korea', 
                city: '서울특별시',
                state: '중구',
                street: '정동',
                hashtag: '러시아공사관'
            }))
        await firebase.assertSucceeds(getFirestore(theirAuth).collection("posts").doc(`post_dummy_3`).set(
            {
                id: '9758a109-3adc-4dc3-a50c-d25afa839e05',
                title: '시청역',
                descript: '서울 시청역',
                date: firebase.firestore.FieldValue.serverTimestamp(),
                profileImg: 'https://avatars.githubusercontent.com/u/16532326?v=4',
                writer: 'stories2stories2stories2stories2stories2stories2stories2stories2stories2',
                good: 0,
                img: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/%EC%8B%9C%EC%B2%AD%EC%97%AD_%EC%97%AD%EB%AA%85%ED%8C%90%282%ED%98%B8%EC%84%A0%29.JPG',
                lat: 37.565559,
                lot: 126.977173,
                visibility: "public",
                authorId: theirAuth.uid,
                country: 'Korea', 
                city: '서울특별시',
                state: '중구',
                street: '정동',
                hashtag: '러시아공사관'
            }))
        await firebase.assertSucceeds(getFirestore(theirAuth).collection("posts").doc(`post_dummy_4`).set(
            {
                id: '5895722f-f12a-4572-9260-888b5b3e2072',
                title: '미국대사관저',
                descript: '미국대사관저',
                date: firebase.firestore.FieldValue.serverTimestamp(),
                profileImg: 'https://avatars.githubusercontent.com/u/16532326?v=4',
                writer: 'stories2stories2stories2stories2stories2stories2stories2stories2stories2',
                good: 0,
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/USA_Embassy_Building_in_Seoul.jpg/270px-USA_Embassy_Building_in_Seoul.jpg',
                lat: 37.566940,
                lot: 126.972958,
                visibility: "public",
                authorId: theirAuth.uid,
                country: 'Korea', 
                city: '서울특별시',
                state: '중구',
                street: '정동',
                hashtag: '러시아공사관'
            }))
        await firebase.assertSucceeds(getFirestore(theirAuth).collection("posts").doc(`post_dummy_5`).set(
            {
                id: '9a9b35a1-d737-4c32-ad1d-0c9329bbd717',
                title: '동화면세점',
                descript: '동화면세점',
                date: firebase.firestore.FieldValue.serverTimestamp(),
                profileImg: 'https://avatars.githubusercontent.com/u/16532326?v=4',
                writer: 'stories2stories2stories2stories2stories2stories2stories2stories2stories2',
                good: 0,
                img: 'https://ir.dwdfs.com/images/sub/about-ceo-visual.jpg',
                lat: 37.569586,
                lot: 126.976187,
                visibility: "private",
                authorId: theirAuth.uid,
                country: 'Korea', 
                city: '서울특별시',
                state: '중구',
                street: '정동',
                hashtag: '러시아공사관'
            }))
        await firebase.assertSucceeds(getFirestore(theirAuth).collection("posts").doc(`post_dummy_6`).set(
            {
                id: '26ddb129-3643-4836-bd99-7c56e6f5fd91',
                title: '주한 콜롬비아 대사관',
                descript: '주한 콜롬비아 대사관',
                date: firebase.firestore.FieldValue.serverTimestamp(),
                profileImg: 'https://avatars.githubusercontent.com/u/16532326?v=4',
                writer: 'stories2stories2stories2stories2stories2stories2stories2stories2stories2',
                good: 0,
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Bogot%C3%A1_embajada_de_Corea_del_Sur.JPG/270px-Bogot%C3%A1_embajada_de_Corea_del_Sur.JPG',
                lat: 37.570936,
                lot: 126.977952,
                visibility: "private",
                authorId: theirAuth.uid,
                country: 'Korea', 
                city: '서울특별시',
                state: '중구',
                street: '정동',
                hashtag: '러시아공사관'
            }))
            
        const myAuth = {uid: myId, email: 'abc@example.com'}
        await firebase.assertSucceeds(getFirestore(myAuth).collection("posts").doc(`post_dummy_7`).set(
            {
                id: '83775fa5-97b0-4dde-92f5-7721d52de1eb',
                title: 'KT광화문지사',
                descript: 'KT광화문지사',
                date: firebase.firestore.FieldValue.serverTimestamp(),
                profileImg: 'https://avatars.githubusercontent.com/u/16532326?v=4',
                writer: 'stories2stories2stories2stories2stories2stories2stories2stories2stories2',
                good: 0,
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_South_Korea_on_building.jpg/300px-Flag_of_South_Korea_on_building.jpg',
                lat: 37.572008,
                lot: 126.977951,
                visibility: "private",
                authorId: myAuth.uid,
                country: 'Korea', 
                city: '서울특별시',
                state: '중구',
                street: '정동',
                hashtag: '러시아공사관'
            }))
        await firebase.assertSucceeds(getFirestore(myAuth).collection("posts").doc(`post_dummy_8`).set(
            {
                id: 'ae3f053e-e0d4-486b-af6e-3d6138d426f9',
                title: '구 러시아공사관',
                descript: '구 러시아공사관',
                date: firebase.firestore.FieldValue.serverTimestamp(),
                profileImg: 'https://avatars.githubusercontent.com/u/16532326?v=4',
                writer: 'stories2stories2stories2stories2stories2stories2stories2stories2stories2',
                good: 0,
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

        await firebase.assertSucceeds(getFirestore(myAuth).collection("posts").doc("post_dummy_1").collection("goods").doc(myAuth.uid).set({
            authorId: myAuth.uid,
            setTime: firebase.firestore.FieldValue.serverTimestamp()
        }))
        await firebase.assertSucceeds(getFirestore(myAuth).collection("posts").doc("post_dummy_2").collection("goods").doc(myAuth.uid).set({
            authorId: myAuth.uid,
            setTime: firebase.firestore.FieldValue.serverTimestamp()
        }))

        function dummyData(idx) {
            return Promise.all(new Array(100).fill(undefined).map(() => {
                const thoseAuth = {uid: randomString(20), email: 'abc@example.com'}
                return getFirestore(thoseAuth).collection("posts").doc(`post_dummy_${idx}`).collection("goods").doc(thoseAuth.uid).set({
                    authorId: thoseAuth.uid,
                    setTime: firebase.firestore.FieldValue.serverTimestamp()
                })
            }))
        }
        await dummyData(1)
        await dummyData(2)
        await dummyData(3)
        await dummyData(4)
        await dummyData(5)
        await dummyData(6)
        await dummyData(7)
        await dummyData(8)
        // 다른 사람쓴 게시물에 내가 좋아요를 표시 했지만 비활성화 되었다는 가정
        await firebase.assertSucceeds(getFirestore(myAuth, true).collection("posts").doc("post_dummy_6").collection("goods").doc(myAuth.uid).set({
            authorId: myAuth.uid,
            setTime: firebase.firestore.FieldValue.serverTimestamp()
        }))
    })
    it("Should checked good mark which is already checked by me [Performance test (Query)]", async () => {
        const myAuth = {uid: myId, email: 'abc@example.com'}

        const [checkGoodMarkedAndPublicOtherPostList, checkGoodMarkedMyPostList] = await Promise.all([
            // 내가 쓴게 아니고 공개 게시물이고, 내가 좋아요를 표시했었는지
            Promise.all(await (await getFirestore(myAuth).collection("posts").where("authorId", "!=", myAuth.uid).where("visibility", "==", "public").get()).docs.map(async item => {
                return {
                    ...(await item.data()),
                    goodMarked: !await (await item.ref.collection("goods").where("authorId", "==", myAuth.uid).get()).empty
                }
            })),
            // 내가 썼지만 위의 데이터 포맷을 맞추기 위함
            Promise.all((await getFirestore(myAuth).collection("posts").where("authorId", "==", myAuth.uid).get()).docs.map(async item => {
                return {
                    ...(await item.data()),
                    goodMarked: false
                }
            }))
        ])

        firebase.assertSucceeds(checkGoodMarkedAndPublicOtherPostList.length === 4)
        firebase.assertSucceeds(checkGoodMarkedAndPublicOtherPostList.filter(item => item.goodMarked).length === 2)
        firebase.assertSucceeds(checkGoodMarkedMyPostList.length === 2)
    })
})