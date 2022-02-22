import React, { useState, createContext } from 'react';
import api from '../api/messaging';

export const MessagingContext = createContext({
  user: {},
  messages: [],
  authors: [],
  resMessages: [],
  growerMessage: {},
  regions: [],
  sendMessageFromGrower: () => {},
  loadMessages: () => {},
  loadRegions: () => {},
  postRegion: () => {},
  getRegionById: () => {},
  postMessage: () => {},
  postMessageSend: () => {},
});

export const MessagingProvider = (props) => {
  const [regions, setRegions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [authors, setAuthors] = useState([]);
  // const [growerMessage, setGrowerMessage] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));

  // useEffect(() => {
  //   loadRegions();
  //   loadAuthors();
  // }, []);

  const groupMessageByHandle = (rawMessages) => {
    // make key of recipients name and group messages together
    let newMessages = rawMessages
      .sort((a, b) => (a.composed_at < b.composed_at ? -1 : 1))
      .reduce((grouped, message) => {
        if (
          message.subject === 'Message' ||
          message.subject === 'Announce Message'
        ) {
          let key =
            message.to[0].recipient !== user.userName
              ? message[`to`][0].recipient
              : message['from'].author;
          if (key) {
            if (!grouped[key] && !messages[key]) {
              grouped[key] = [];
            }
            grouped[key].push(message);
          }
        } else if (message.subject === 'Survey') {
          let key = message.survey.id;
          if (!grouped[key]) {
            grouped[key] = [];
          }
          grouped[key].push(message);
        }
        return grouped;
      }, {});
    const filteredMessages = [
      ...Object.entries(newMessages).map(([key, val]) => {
        if (key && val) {
          return {
            userName: key,
            messages: val,
          };
        }
      }),
    ];
    setMessages(filteredMessages);
  };

  const loadAuthors = async () => {
    const res = await api.getAuthors();

    if (res) {
      let result = res.authors.filter(
        (author) => author.handle !== user.userName
      );
      setAuthors(result);
    }
  };

  const postRegion = async (payload) => {
    await api.postRegion(payload);
  };

  const getRegionById = async (id) => {
    await api.getRegionById(id);
  };

  const postMessage = async (payload) => {
    return api.postMessage(payload);
  };

  const postMessageSend = (payload) => {
    if (payload) {
      return api.postMessageSend(payload);
    } else {
      return 'Were sorry something went wrong. Please try again.';
    }
  };

  const sendMessageFromGrower = (grower) => {
    const payload = {
      body: '',
      from: user.userName,
      subject: 'Message',
      to: grower.phone ? grower.phone : grower.email,
    };

    if (payload.to) {
      // setGrowerMessage(payload);
    }
  };

  const loadMessages = async () => {
    console.log('loadMessages');
    // const res = await api.getMessage(user.userName);
    let res = fakeData;
    // ! added offline survey data to get the structure
    // * if DB is working Uncomment
    // console.log(res.messages);
    // if (res && growerMessage) {
    //   groupMessageByHandle([growerMessage, ...res.messages]);
    // } else {
    //   groupMessageByHandle(res.messages);

    // }
    // * then delete this
    groupMessageByHandle(res);
  };

  const loadRegions = async () => {
    const res = await api.getRegion();

    if (res) {
      setRegions(res);
    }
  };

  const value = {
    user,
    messages,
    authors,
    regions,
    sendMessageFromGrower,
    loadMessages,
    loadRegions,
    loadAuthors,
    postRegion,
    getRegionById,
    postMessage,
    postMessageSend,
  };

  return (
    <MessagingContext.Provider value={value}>
      {props.children}
    </MessagingContext.Provider>
  );
};

const fakeData = [
  {
    body: 'Something',
    composed_at: '2022-02-20T23:00:40.499Z',
    from: { author: 'admin', type: 'user' },
    id: '1b8b227b-9f20-488d-9593-8436c57c631c',
    parent_message_id: '9b5779c8-04e2-43d3-856e-4b5b69da51a2',
    subject: 'Survey',
    survey: {
      id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
      questions: [
        {
          prompt: 'What time do you plant?',
          choices: ['Morning', 'Afternoon', 'Night'],
        },
        { prompt: 'What time do you Water?', choices: ['one', 'two', 'three'] },
        {
          prompt: 'How many trees have you planted?',
          choices: ['1-3', '4-6', '6-9'],
        },
      ],
      response: null,
      answers: null,
    },
    title: null,
    to: [{ recipient: 'handle1', type: 'user' }],
    video_link: null,
  },
  {
    body: 'Something',
    composed_at: '2022-02-20T23:00:40.499Z',
    from: { author: 'handle1', type: 'user' },
    id: '969a6321-f9e6-482e-9e2f-440fddbdf2ac',
    parent_message_id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
    subject: 'Survey',
    survey: {
      id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
      questions: null,
      response: true,
      answers: ['Morning', 'two', '4-6'],
    },
    title: null,
    to: [{ recipient: 'admin', type: 'user' }],
    video_link: null,
  },
  {
    body: 'Something',
    composed_at: '2022-02-20T23:00:40.499Z',
    from: { author: 'handle1', type: 'user' },
    id: '2dd50d11-2493-48a4-80b0-7eaf840e8c31',
    parent_message_id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
    subject: 'Survey',
    survey: {
      id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
      questions: null,
      response: true,
      answers: ['Morning', 'two', '6-9'],
    },
    title: null,
    to: [{ recipient: 'admin', type: 'user' }],
    video_link: null,
  },
  {
    body: 'Something',
    composed_at: '2022-02-20T23:00:40.499Z',
    from: { author: 'handle1', type: 'user' },
    id: 'c8603bac-0b9a-4a51-a6a1-a9b192a8dace',
    parent_message_id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
    subject: 'Survey',
    survey: {
      id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
      questions: null,
      response: true,
      answers: ['Afternoon', 'two', '6-9'],
    },
    title: null,
    to: [{ recipient: 'admin', type: 'user' }],
    video_link: null,
  },
  {
    body: 'Something',
    composed_at: '2022-02-20T23:00:40.499Z',
    from: { author: 'handle1', type: 'user' },
    id: '969a6321-f9e6-482e-9e2f-440fddbdf2ac',
    parent_message_id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
    subject: 'Survey',
    survey: {
      id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
      questions: null,
      response: true,
      answers: ['Afternoon', 'two', '6-9'],
    },
    title: null,
    to: [{ recipient: 'admin', type: 'user' }],
    video_link: null,
  },
  {
    body: 'Something',
    composed_at: '2022-02-20T23:00:40.499Z',
    from: { author: 'handle1', type: 'user' },
    id: '95d17a04-2e8f-4a14-a373-d1db260d030a',
    parent_message_id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
    subject: 'Survey',
    survey: {
      id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
      questions: null,
      response: true,
      answers: ['Afternoon', 'two', '6-9'],
    },
    title: null,
    to: [{ recipient: 'admin', type: 'user' }],
    video_link: null,
  },
  {
    body: 'Something',
    composed_at: '2022-02-20T23:00:40.499Z',
    from: { author: 'handle1', type: 'user' },
    id: '807a5fbe-53b1-4604-bb57-358397374e02',
    parent_message_id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
    subject: 'Survey',
    survey: {
      id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
      questions: null,
      response: true,
      answers: ['Afternoon', 'two', '6-9'],
    },
    title: null,
    to: [{ recipient: 'admin', type: 'user' }],
    video_link: null,
  },
  {
    body: 'Something',
    composed_at: '2022-02-20T23:00:40.499Z',
    from: { author: 'handle1', type: 'user' },
    id: '34b30d7f-91fe-44ed-8a77-f80512b8d918',
    parent_message_id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
    subject: 'Survey',
    survey: {
      id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
      questions: null,
      response: true,
      answers: ['Afternoon', 'two', '6-9'],
    },
    title: null,
    to: [{ recipient: 'admin', type: 'user' }],
    video_link: null,
  },
  {
    body: 'Something',
    composed_at: '2022-02-20T23:00:40.499Z',
    from: { author: 'handle1', type: 'user' },
    id: '20c2ac1f-5b63-402d-9d04-040d47553747',
    parent_message_id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
    subject: 'Survey',
    survey: {
      id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
      questions: null,
      response: true,
      answers: ['Afternoon', 'three', '1-3'],
    },
    title: null,
    to: [{ recipient: 'admin', type: 'user' }],
    video_link: null,
  },
  {
    body: 'Something',
    composed_at: '2022-02-20T23:00:40.499Z',
    from: { author: 'handle1', type: 'user' },
    id: '3867903c-31c1-42b6-8df5-ee8b41bcea7d',
    parent_message_id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
    subject: 'Survey',
    survey: {
      id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
      questions: null,
      response: true,
      answers: ['Night', 'one', '1-3'],
    },
    title: null,
    to: [{ recipient: 'admin', type: 'user' }],
    video_link: null,
  },
  {
    body: 'Something',
    composed_at: '2022-02-20T23:00:40.499Z',
    from: { author: 'admin', type: 'user' },
    id: '1b8b227b-9f20-488d-9593-8436c57c631c',
    parent_message_id: '9b5779c8-04e2-43d3-856e-4b5b69da51a2',
    subject: 'Survey',
    survey: {
      id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
      questions: [
        { prompt: 'What direction?', choices: ['North ', 'South', 'East'] },
        { prompt: 'What time do you Water?', choices: ['one', 'two', 'three'] },
        { prompt: 'How many captures?', choices: ['1-3', '4-6', '6-9'] },
      ],
      response: null,
      answers: null,
    },
    title: null,
    to: [{ recipient: 'handle2', type: 'user' }],
    video_link: null,
  },
  {
    body: 'Something',
    composed_at: '2022-02-20T23:00:40.499Z',
    from: { author: 'handle1', type: 'user' },
    id: 'f3213a37-6868-4113-ae61-648a1913fea9',
    parent_message_id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
    subject: 'Survey',
    survey: {
      id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
      questions: null,
      response: true,
      answers: ['North', 'one', '1-3'],
    },
    title: null,
    to: [{ recipient: 'admin', type: 'user' }],
    video_link: null,
  },
  {
    body: 'Something',
    composed_at: '2022-02-20T23:00:40.499Z',
    from: { author: 'handle1', type: 'user' },
    id: '8ac0585d-d174-4f13-8705-c1b3c881228c',
    parent_message_id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
    subject: 'Survey',
    survey: {
      id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
      questions: null,
      response: true,
      answers: ['South', 'two', '4-6'],
    },
    title: null,
    to: [{ recipient: 'admin', type: 'user' }],
    video_link: null,
  },
  {
    body: 'Something',
    composed_at: '2022-02-20T23:00:40.499Z',
    from: { author: 'handle2', type: 'user' },
    id: '7f0fd873-92dc-4e2c-adf5-2d5f9d6eb101',
    parent_message_id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
    subject: 'Survey',
    survey: {
      id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
      questions: null,
      response: true,
      answers: ['North', 'one', '1-3'],
    },
    title: null,
    to: [{ recipient: 'admin', type: 'user' }],
    video_link: null,
  },
  {
    body: 'Something',
    composed_at: '2022-02-20T23:00:40.499Z',
    from: { author: 'handle2', type: 'user' },
    id: 'asdf9ac5-aaa7-4147-8274-25dca0d09329',
    parent_message_id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
    subject: 'Survey',
    survey: {
      id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
      questions: null,
      response: true,
      answers: ['East', 'three', '6-9'],
    },
    title: null,
    to: [{ recipient: 'admin', type: 'user' }],
    video_link: null,
  },
  {
    body: 'Something',
    composed_at: '2022-02-20T23:00:40.499Z',
    from: { author: 'handle1', type: 'user' },
    id: 'f3213a37-6868-4113-asdf-648a1913fea9',
    parent_message_id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
    subject: 'Survey',
    survey: {
      id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
      questions: null,
      response: true,
      answers: ['North', 'one', '1-3'],
    },
    title: null,
    to: [{ recipient: 'admin', type: 'user' }],
    video_link: null,
  },
  {
    body: 'Something',
    composed_at: '2022-02-20T23:00:40.499Z',
    from: { author: 'handle1', type: 'user' },
    id: '8ac0585d-d174-asdf-8705-c1b3c881228c',
    parent_message_id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
    subject: 'Survey',
    survey: {
      id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
      questions: null,
      response: true,
      answers: ['South', 'two', '4-6'],
    },
    title: null,
    to: [{ recipient: 'admin', type: 'user' }],
    video_link: null,
  },
  {
    body: 'Something',
    composed_at: '2022-02-20T23:00:40.499Z',
    from: { author: 'handle2', type: 'user' },
    id: '7f0fasdf-92dc-4e2c-adf5-2d5f9d6eb101',
    parent_message_id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
    subject: 'Survey',
    survey: {
      id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
      questions: null,
      response: true,
      answers: ['North', 'one', '1-3'],
    },
    title: null,
    to: [{ recipient: 'admin', type: 'user' }],
    video_link: null,
  },
  {
    body: 'Something',
    composed_at: '2022-02-20T23:00:40.499Z',
    from: { author: 'handle2', type: 'user' },
    id: '53849ac5-aaa7-4147-8274-25dcasdf329',
    parent_message_id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
    subject: 'Survey',
    survey: {
      id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
      questions: null,
      response: true,
      answers: ['East', 'three', '6-9'],
    },
    title: null,
    to: [{ recipient: 'admin', type: 'user' }],
    video_link: null,
  },
];
