const moment = require('moment');
const mongoose = require('mongoose');

const user0Id = mongoose.Types.ObjectId();
const user1Id = mongoose.Types.ObjectId();
const user2Id = mongoose.Types.ObjectId();
const user3Id = mongoose.Types.ObjectId();
const user4Id = mongoose.Types.ObjectId();
const user5Id = mongoose.Types.ObjectId();
const user6Id = mongoose.Types.ObjectId();
const user7Id = mongoose.Types.ObjectId();
const user8Id = mongoose.Types.ObjectId();
const user9Id = mongoose.Types.ObjectId();
const user10Id = mongoose.Types.ObjectId();
const user11Id = mongoose.Types.ObjectId();
const user12Id = mongoose.Types.ObjectId();
const user13Id = mongoose.Types.ObjectId();
const user14Id = mongoose.Types.ObjectId();
const user15Id = mongoose.Types.ObjectId();
const user16Id = mongoose.Types.ObjectId();
const user17Id = mongoose.Types.ObjectId();
const user18Id = mongoose.Types.ObjectId();
const user19Id = mongoose.Types.ObjectId();
const user20Id = mongoose.Types.ObjectId();

const meetup1Id = mongoose.Types.ObjectId();
const meetup2Id = mongoose.Types.ObjectId();
const meetup3Id = mongoose.Types.ObjectId();
const meetup4Id = mongoose.Types.ObjectId();
const meetup5Id = mongoose.Types.ObjectId();
const meetup6Id = mongoose.Types.ObjectId();

const thread1Id = mongoose.Types.ObjectId();
const thread2Id = mongoose.Types.ObjectId();
const thread3Id = mongoose.Types.ObjectId();

const post1Id = mongoose.Types.ObjectId();
const post2Id = mongoose.Types.ObjectId();
const post3Id = mongoose.Types.ObjectId();
const post4Id = mongoose.Types.ObjectId();
const post5Id = mongoose.Types.ObjectId();

const category1Id = mongoose.Types.ObjectId();
const category2Id = mongoose.Types.ObjectId();
const category3Id = mongoose.Types.ObjectId();
const category4Id = mongoose.Types.ObjectId();
const category5Id = mongoose.Types.ObjectId();

module.exports = {
  "meetups": [
     {
      "_id": meetup1Id,
      "location": "Bratislava, SK",
      "processedLocation": "bratislavask",
      "title": "Night in the City",
      "image": "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2452&q=80",
      "description": "Some description of this event. I dont know what to talk about",
      "shortInfo": "Just some short info, I don't kow just be yourself.",
      "createdAt": moment().toISOString(),
      "updatedAt": moment().toISOString(),
      "startDate": moment().add(2, 'days').toISOString(),
      "timeFrom": "14:00",
      "timeTo": "18:00",
      "joinedPeopleCount": 1,
      "status": "active",
      "category": category1Id,
      "joinedPeople": [user2Id],
      "meetupCreator": user1Id
    },
    {
      "_id": meetup2Id,
      "location": "New York, US",
      "processedLocation": "newyorkus",
      "title": "New Aquaman",
      "image": "https://images.unsplash.com/photo-1527956041665-d7a1b380c460?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
      "description": "Lets watch new aquaman together",
      "shortInfo": "Just some short info, I don't kow just be yourself.",
      "createdAt": moment().toISOString(),
      "updatedAt": moment().toISOString(),
      "startDate": moment().add(7, 'days').toISOString(),
      "timeFrom": "08:00",
      "timeTo": "10:00",
      "joinedPeopleCount": 2,
      "status": "active",
      "category": category2Id,
      "joinedPeople": [user1Id, user3Id],
      "meetupCreator": user2Id
    },
    {
      "_id": meetup3Id,
      "location": "Lisbon, PT",
      "processedLocation": "lisbonpt",
      "title": "Cycling Together",
      "image": "https://images.unsplash.com/photo-1527956041665-d7a1b380c460?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
      "description": "Lets watch new Tour De France",
      "shortInfo": "Just some short info, I don't kow just be yourself.",
      "createdAt": moment().toISOString(),
      "updatedAt": moment().toISOString(),
      "startDate": moment().add(7, 'days').toISOString(),
      "timeFrom": "08:00",
      "timeTo": "10:00",
      "joinedPeopleCount": 2,
      "status": "active",
      "category": category5Id,
      "joinedPeople": [user1Id, user3Id],
      "meetupCreator": user2Id
    },
    {
      "_id": meetup4Id,
      "location": "Los Angeles, US",
      "processedLocation": "losangelesus",
      "title": "New Aquaman 2",
      "image": "https://images.unsplash.com/photo-1527956041665-d7a1b380c460?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
      "description": "Lets watch new aquaman together",
      "shortInfo": "Just some short info, I don't kow just be yourself.",
      "createdAt": moment().toISOString(),
      "updatedAt": moment().toISOString(),
      "startDate": moment().add(7, 'days').toISOString(),
      "timeFrom": "08:00",
      "timeTo": "10:00",
      "joinedPeopleCount": 2,
      "status": "active",
      "category": category1Id,
      "joinedPeople": [user1Id, user3Id],
      "meetupCreator": user2Id
    },
    {
      "_id": meetup5Id,
      "location": "Berlin, GE",
      "processedLocation": "berlinge",
      "title": "New Aquaman 5",
      "image": "https://images.unsplash.com/photo-1527956041665-d7a1b380c460?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
      "description": "Lets watch new aquaman together",
      "shortInfo": "Just some short info, I don't kow just be yourself.",
      "createdAt": moment().toISOString(),
      "updatedAt": moment().toISOString(),
      "startDate": moment().add(7, 'days').toISOString(),
      "timeFrom": "08:00",
      "timeTo": "10:00",
      "joinedPeopleCount": 2,
      "status": "active",
      "category": category2Id,
      "joinedPeople": [user1Id, user3Id],
      "meetupCreator": user2Id
    },
    {
      "_id": meetup6Id,
      "location": "London, UK",
      "processedLocation": "londonuk",
      "title": "New Spiderman",
      "image": "https://images.unsplash.com/photo-1527956041665-d7a1b380c460?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
      "description": "Lets watch new spiderman together",
      "shortInfo": "Just some short info, I don't kow just be yourself.",
      "createdAt": moment().toISOString(),
      "updatedAt": moment().toISOString(),
      "startDate": moment().add(7, 'days').toISOString(),
      "timeFrom": "08:00",
      "timeTo": "10:00",
      "joinedPeopleCount": 2,
      "status": "active",
      "category": category3Id,
      "joinedPeople": [user1Id, user3Id],
      "meetupCreator": user2Id
    },
  ],
  "users": [
    {
      "_id": user0Id,
      "email": "me@me.com",
      "avatar": "https://robohash.org/6d4ab0cdad42f7d63074fa6d76073545?set=set3&bgset=&size=200x200",
      "info": "Team LA",
      "password": "Password#1",
      "role": "admin",
      "profile": {
        "name": "Team LA",
        "location": "Los Angeles, CA",
        "gender": "Male",
        "website": "svelte.com"
      },
      joinedMeetups: [meetup2Id, meetup3Id, meetup4Id, meetup5Id, meetup6Id]
    },
    {
      "_id": user1Id,
      "email": "me1@me.com",
      "avatar": "https://gravatar.com/avatar/6d4ab0cdad42f7d63074fa6d76073545?s=200&d=robohash&r=x",
      "info": "Bla bla bla bla",
      "password": "Password#1",
      "role": "customer",
      "profile": {
        "name": "Team LA",
        "location": "Los Angeles, CA",
        "gender": "Male",
        "website": "mysite.com"
      },
      joinedMeetups: [meetup2Id, meetup3Id, meetup4Id, meetup5Id, meetup6Id]
    },
    {
      "_id": user2Id,
      "email": "me2@me.com",
      "avatar": "https://robohash.org/6d4ab0cdad42f7d63074fa6d76073545?set=set3&bgset=&size=200x200",
      "info": "More bla bla",
      "password": "Password#1",
      "role": "customer",
      "profile": {
        "name": "Tommmy",
        "location": "Burbank, CA",
        "gender": "Male",
        "website": "tommy.com"
      },
      joinedMeetups: [meetup1Id]
    },
    {
      "_id": user3Id,
      "email": "me3@me.com",
      "avatar": "https://robohash.org/6d4ab0cdad42f7d63074fa6d76073545?set=set4&bgset=&size=200x200",
      "info": "More from me1 bla bla",
      "password": "Password#1",
      "role": "customer",
      "profile": {
        "name": "Margot",
        "location": "Los Felis, CA",
        "gender": "Female",
        "website": "era.com"
      },
      joinedMeetups: [meetup2Id, meetup3Id, meetup4Id, meetup5Id, meetup6Id]
    },
    {
      "_id": user4Id,
      "email": "me4@me.com",
      "avatar": "https://robohash.org/6d4ab0cdad42f7d63074fa6d76073545?set=set3&bgset=&size=200x200",
      "info": "My secret info",
      "password": "Password#1",
      "role": "customer",
      "profile": {
        "name": "David",
        "location": "Santa Ana, CA",
        "gender": "Male",
        "website": ""
      },
      joinedMeetups: [meetup1Id]
    },
    ,
    {
      "_id": user5Id,
      "email": "me5@me.com",
      "avatar": "https://robohash.org/6d4ab0cdad42f7d63074fa6d76073545?set=set3&bgset=&size=200x200",
      "info": "My secret info",
      "password": "Password#1",
      "role": "customer",
      "profile": {
        "name": "Memem",
        "location": "Culver City, CA",
        "gender": "Male",
        "website": ""
      },
      joinedMeetups: [meetup1Id]
    },
    {
      "_id": user6Id,
      "email": "me6@me.com",
      "avatar": "https://robohash.org/6d4ab0cdad42f7d63074fa6d76073545?set=set3&bgset=&size=200x200",
      "info": "My secret info",
      "password": "Password#1",
      "role": "customer",
      "profile": {
        "name": "Saul G.",
        "location": "San Diego, CA",
        "gender": "Male",
        "website": ""
      },
      joinedMeetups: [meetup1Id]
    },
    {
      "_id": user7Id,
      "email": "me7@me.com",
      "avatar": "https://robohash.org/6d4ab0cdad42f7d63074fa6d76073545?set=set3&bgset=&size=200x200",
      "info": "My secret info",
      "password": "Password#1",
      "role": "customer",
      "profile": {
        "name": "Lucky One",
        "location": "Las Brisas, CA",
        "gender": "Female",
        "website": ""
      },
      joinedMeetups: [meetup1Id]
    },
    {
      "_id": user8Id,
      "email": "me8@me.com",
      "avatar": "https://robohash.org/6d4ab0cdad42f7d63074fa6d76073545?set=set3&bgset=&size=200x200",
      "info": "My secret info",
      "password": "Password#1",
      "role": "customer",
      "profile": {
        "name": "Maximus",
        "location": "San Jose, CA",
        "gender": "Male",
        "website": ""
      },
      joinedMeetups: [meetup1Id]
    },
    {
      "_id": user9Id,
      "email": "me9@me.com",
      "avatar": "https://robohash.org/6d4ab0cdad42f7d63074fa6d76073545?set=set3&bgset=&size=200x200",
      "info": "My secret info",
      "password": "Password#1",
      "role": "customer",
      "profile": {
        "name": "Tom Tim",
        "location": "El Pito, CA",
        "gender": "Male",
        "website": ""
      },
      joinedMeetups: [meetup1Id]
    },
    {
      "_id": user10Id,
      "email": "me10@me.com",
      "avatar": "https://robohash.org/6d4ab0cdad42f7d63074fa6d76073545?set=set3&bgset=&size=200x200",
      "info": "My secret info",
      "password": "Password#1",
      "role": "customer",
      "profile": {
        "name": "Lin Jhon",
        "location": "San Diego, CA",
        "gender": "Female",
        "website": ""
      },
      joinedMeetups: [meetup1Id]
    },
    {
      "_id": user11Id,
      "email": "me11@me.com",
      "avatar": "https://gravatar.com/avatar/6d4ab0cdad42f7d63074fa6d76073545?s=200&d=robohash&r=x",
      "info": "My secret info",
      "password": "Password#1",
      "role": "customer",
      "profile": {
        "name": "Arthur G",
        "location": "Cupertino, CA",
        "gender": "Male",
        "website": ""
      },
      joinedMeetups: [meetup1Id]
    },
    {
      "_id": user12Id,
      "email": "me12@me.com",
      "avatar": "https://robohash.org/6d4ab0cdad42f7d63074fa6d76073545?set=set3&bgset=&size=200x200",
      "info": "My secret info",
      "password": "Password#1",
      "role": "customer",
      "profile": {
        "name": "Aida Lina",
        "location": "Feliz City, CA",
        "gender": "Female",
        "website": ""
      },
      joinedMeetups: [meetup1Id]
    },
    {
      "_id": user13Id,
      "email": "me13@me.com",
      "avatar": "https://gravatar.com/avatar/6d4ab0cdad42f7d63074fa6d76073545?s=200&d=robohash&r=x",
      "info": "My secret info",
      "password": "Password#1",
      "role": "customer",
      "profile": {
        "name": "King Arthur",
        "location": "Cupertino, CA",
        "gender": "Male",
        "website": ""
      },
      joinedMeetups: [meetup1Id]
    },
    {
      "_id": user14Id,
      "email": "me14@me.com",
      "avatar": "https://robohash.org/6d4ab0cdad42f7d63074fa6d76073545?set=set3&bgset=&size=200x200",
      "info": "My secret info",
      "password": "Password#1",
      "role": "customer",
      "profile": {
        "name": "Lindador G",
        "location": "Phoenix, AZ",
        "gender": "Female",
        "website": ""
      },
      joinedMeetups: [meetup1Id]
    },
    {
      "_id": user15Id,
      "email": "me15@me.com",
      "avatar": "https://gravatar.com/avatar/6d4ab0cdad42f7d63074fa6d76073545?s=200&d=robohash&r=x",
      "info": "My secret info",
      "password": "Password#1",
      "role": "customer",
      "profile": {
        "name": "Strophie Lyn",
        "location": "Quito, EQ",
        "gender": "Male",
        "website": ""
      },
      joinedMeetups: [meetup1Id]
    },
    {
      "_id": user16Id,
      "email": "me16@me.com",
      "avatar": "https://robohash.org/6d4ab0cdad42f7d63074fa6d76073545?set=set3&bgset=&size=200x200",
      "info": "My secret info",
      "password": "Password#1",
      "role": "customer",
      "profile": {
        "name": "Blanco Nieve",
        "location": "North Pole, QB",
        "gender": "Female",
        "website": ""
      },
      joinedMeetups: [meetup1Id]
    },
    {
      "_id": user17Id,
      "email": "me17@me.com",
      "avatar": "https://gravatar.com/avatar/6d4ab0cdad42f7d63074fa6d76073545?s=200&d=robohash&r=x",
      "info": "My secret info",
      "password": "Password#1",
      "role": "customer",
      "profile": {
        "name": "Kentucky Ho",
        "location": "China, EQ",
        "gender": "Male",
        "website": ""
      },
      joinedMeetups: [meetup1Id]
    },
    {
      "_id": user18Id,
      "email": "me18@me.com",
      "avatar": "https://robohash.org/6d4ab0cdad42f7d63074fa6d76073545?set=set3&bgset=&size=200x200",
      "info": "My secret info",
      "password": "Password#1",
      "role": "customer",
      "profile": {
        "name": "Franck S.",
        "location": "North Hills, CA",
        "gender": "Male",
        "website": ""
      },
      joinedMeetups: [meetup1Id]
    },
    {
      "_id": user19Id,
      "email": "me19@me.com",
      "avatar": "https://gravatar.com/avatar/6d4ab0cdad42f7d63074fa6d76073545?s=200&d=robohash&r=x",
      "info": "My secret info",
      "password": "Password#1",
      "role": "customer",
      "profile": {
        "name": "Francis II",
        "location": "New Mexico, NM",
        "gender": "Male",
        "website": ""
      },
      joinedMeetups: [meetup1Id]
    },
    {
      "_id": user20Id,
      "email": "me20@me.com",
      "avatar": "https://robohash.org/6d4ab0cdad42f7d63074fa6d76073545?set=set3&bgset=&size=200x200",
      "info": "My secret info",
      "password": "Password#1",
      "role": "customer",
      "profile": {
        "name": "Twenty",
        "location": "Twenty Hills, KL",
        "gender": "Female",
        "website": ""
      },
      joinedMeetups: [meetup1Id]
    },
  ],
  "threads": [
    {
      "_id": thread1Id,
      "title": "Should I take some food?",
      "createdAt": moment().toISOString(),
      "updatedAt": moment().toISOString(),
      "meetup": meetup1Id,
      "user": user1Id,
      "posts": [post1Id, post2Id]
    },
    {
      "_id": thread2Id,
      "title": "I dont know what to think about this.",
      "createdAt": moment().toISOString(),
      "updatedAt": moment().toISOString(),
      "meetup": meetup2Id,
      "user": user2Id,
      "posts": [post3Id, post4Id]
    },
    {
      "_id": thread3Id,
      "title": "Here should be something about thread 3",
      "createdAt": moment().toISOString(),
      "updatedAt": moment().toISOString(),
      "meetup": meetup2Id,
      "user": user2Id,
      "posts": [post5Id]
    }
  ],
  "posts": [
    {
      "_id": post1Id,
      "text": "I will be late",
      "createdAt": moment().toISOString(),
      "updatedAt": moment().toISOString(),
      "thread": thread1Id,
      "user": user1Id
    },
    {
      "_id": post2Id,
      "text": "I like turtles",
      "createdAt": moment().toISOString(),
      "updatedAt": moment().toISOString(),
      "thread": thread1Id,
      "user": user1Id
    },
    {
      "_id": post3Id,
      "text": "I will be late",
      "createdAt": moment().toISOString(),
      "updatedAt": moment().toISOString(),
      "thread": thread2Id,
      "user": user2Id,
    },
    {
      "_id": post4Id,
      "text": "I like turtles",
      "createdAt": moment().toISOString(),
      "updatedAt": moment().toISOString(),
      "thread": thread2Id,
      "user": user2Id,
    },
    {
      "_id": post5Id,
      "text": "I like writing about nothing",
      "createdAt": moment().toISOString(),
      "updatedAt": moment().toISOString(),
      "thread": thread3Id,
      "user": user2Id,
    }
  ],
  "categories": [
    {
      "_id": category1Id,
      "name": "sport",
      "image": "https://images.unsplash.com/photo-1508355991726-ebd81e4802f7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1506&q=80"
    },{
      "_id": category2Id,
      "name": "cinema",
      "image": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
      "image2": "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1502&q=80",
      "image3": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
    },
    {
      "_id": category3Id,
      "name": "music",
      "image": "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1334&q=80"
    },
    {
      "_id": category4Id,
      "name": "dance",
      "image": "https://images.unsplash.com/photo-1509670811615-bb8b07cb3caf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1510&q=80"
    },
    {
      "_id": category5Id,
      "name": "party",
      "image": "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80"
    },
    {
      "_id": mongoose.Types.ObjectId(),
      "name": "literature",
      "image": "https://images.unsplash.com/photo-1490633874781-1c63cc424610?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80"
    },
    {
      "_id": mongoose.Types.ObjectId(),
      "name": "food",
      "image": "https://images.unsplash.com/photo-1536510233921-8e5043fce771?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1542&q=80"
    },
    {
      "_id": mongoose.Types.ObjectId(),
      "name": "games",
      "image": "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80"
    }
  ]
};
