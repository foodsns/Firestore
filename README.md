# 먹었소 Firebase Firestore Spec

<div align="center">
    <img src="https://avatars.githubusercontent.com/u/90189814?s=200&v=4" width="180">
</div>

## Post

### Spec

----------------------------------------------------
- `/posts` collection

> 게시물 정보

|Key|Required|Type|Limit|Descript|
|:---:|:---:|:---:|:---:|:---:|
|id|O|`string`|20 <= length < 40|유니크 ID 값, Ex) `GUID`|
|title|O|`string`|2 <= length < 200|게시물 제목|
|descript|O|`string`|2 <= length < 200|게시물 내용|
|date|O|`string`|2 <= length < 100|게시물 작성 일 `<추후 변동 가능성 있음>`|
|profileImg|O|`string`|length < 1000, http, https url 주소|작성자 프로필 이미지 주소|
|writer|O|`string`|length < 500|작성자 이름|
|good|O|`int`|초깃값 0 할당해야 함|좋아요 수 `<좋아요 클릭마다 트렌젝션 필요>`|
|img|O|`string`|length < 1000, http, https url 주소|게시물 이미지 `<추후 변동 가능성 있음>`|
|lat|O|`float`|-90 <= lat <= 90|위도|
|lot|O|`float`|-180 <= lot <= 180|경도|
|visibility|O|`string`|```(public)\|(private)```|공개 / 비공개|
|authorId|O|`string`|auth.uid == authorId|작성자의 Firebase uid|
|country|O|`string`|4 <= length < 100|나라 이름|
|city|O|`string`|2 <= length < 100|시,군,구 이름|
|state|O|`string`|2 <= length < 100|도시,도 이름|
|street|O|`string`|2 <= length < 100|읍,면,동 이름|
|hashtag|O|`string`|2 <= length < 50|해시태그|

### Example Select posts with thumbs up mark key (source)

```
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
```

- Performance test

Each 8 posts have 1000 likes.

```
Test goods collection with complex query
    ✔ Should checked good mark which is already checked by me (410ms)
    ✔ Should checked good mark which is already checked by me [Performance test (Data gen)] (106592ms)
    ✔ Should checked good mark which is already checked by me [Performance test (Query)] (227ms)
```

### Example Insert

```
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
}
```

### Example update

```
{
    title: '구 러시아공사관',
    descript: '구 러시아공사관',
    date: '2021년 9월 4일',
    profileImg: 'https://avatars.githubusercontent.com/u/16532326?v=4',
    writer: 'stories2stories2stories2stories2stories2stories2stories2stories2stories2',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Former_Russia_legation_of_Korea_01.JPG/272px-Former_Russia_legation_of_Korea_01.JPG',
    lat: 37.568178,
    lot: 126.971474,
    visibility: "public",
    country: 'Korea', 
    city: '서울특별시',
    state: '중구',
    street: '정동',
    hashtag: '러시아공사관'
}
```

### Example increase good count (source)

```
ref.firestore.runTransaction(async (transaction) => {
    const data = await (await ref.get()).data()
    transaction.update(ref, {good: data.good + 1})
})
```

----------------------------------------------------

- `/posts/*/goods` collection

> 해당 게시물에 좋아요가 눌린 기록

|Key|Required|Type|Limit|Descript|
|:---:|:---:|:---:|:---:|:---:|
|authorId|O|`string`|auth.uid == authorId|좋아요 누른 자기 자신의 uid|
|setTime|O|`timestamp`|`firebase.firestore.FieldValue.serverTimestamp()`|좋아요 누른 시각|

### Example get posts which is marked as good by me (source)

```
Promise.allSettled((await getFirestore(myAuth).collectionGroup('goods').where("authorId", "==", `${myAuth.uid}`).get()).docs.map(async (item) => await ((await item.ref.parent.parent.get()).data())))
```

### Example mark as good by me

```
{
    authorId: myAuth.uid,
    setTime: firebase.firestore.FieldValue.serverTimestamp()
}
```

----------------------------------------------------
## User

### Spec

----------------------------------------------------
- `/users` collection

> 사용자 정보

|Key|Required|Type|Limit|Descript|
|:---:|:---:|:---:|:---:|:---:|
|displayName|O|`string`|2 <= length < 500|사용자 닉네임|
|email|O|`string`|`^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$`|이메일 주소 포멧|
|emailVerified|O|`bool`|```true\|false```|이메일 인증됨 여부|
|phoneNumber|X|`string`|`^[0-9]{3}[-]+[0-9]{3,4}[-]+[0-9]{3,4}$`|전화번호 포멧|
|photoURL|O|`string`|length < 1000, http, https url|사용자 프로필 이미지 주소|
|lastLogin|O|`timestamp`|`firebase.firestore.FieldValue.serverTimestamp()`|마지막 로그인 시간|

### Example insert / update

```
{
    displayName: 'USER_A',
    email: 'USER_A@example.com',
    emailVerified: false,
    phoneNumber: '010-0000-0000',
    photoURL: 'https://avatars.githubusercontent.com/u/90189814?s=200&v=4',
    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
}
```
----------------------------------------------------


## Getting start

* Run firebase emulator using

```
firebase emulators:start
```

* Run testcase using

```
cd test
npm test
```

https://user-images.githubusercontent.com/16532326/136420084-57a6e316-c550-4481-84b4-5c2892ea1859.mov

## Tutorial

[![Video Label](https://img.youtube.com/vi/VDulvfBpzZE/0.jpg)](https://youtu.be/VDulvfBpzZE)
