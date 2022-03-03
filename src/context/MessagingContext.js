import React, { useState, createContext } from 'react';
import api from '../api/messaging';
const log = require('loglevel');

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
  const [growerMessage, setGrowerMessage] = useState({});
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
        if (message.type === 'message') {
          let key = message.to !== user.userName ? message.to : message.from;
          if (key) {
            if (!grouped[key] && !messages[key]) {
              grouped[key] = [];
            }
            grouped[key].push(message);
          }
        } else if (message.type === 'survey') {
          let key = message.survey.id;
          if (!grouped[key]) {
            grouped[key] = [message];
          }
        } else if (message.type === 'announce') {
          // add date to create unique key for similar announements
          let key = `${message.subject}-${Date.now()}`;
          grouped[key] = [message];
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
        (author) => author.author_handle !== user.userName
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

  const postBulkMessageSend = (payload) => {
    if (payload) {
      return api.postBulkMessageSend(payload);
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
      setGrowerMessage(payload);
    }
  };

  const loadMessages = async () => {
    log.debug('loadMessages');
    const res = await api.getMessages(user.userName);
    if (res && growerMessage) {
      groupMessageByHandle([growerMessage, ...res.messages]);
    } else {
      groupMessageByHandle(res.messages);
    }
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
    postBulkMessageSend,
  };

  return (
    <MessagingContext.Provider value={value}>
      {props.children}
    </MessagingContext.Provider>
  );
};
