import React, { useState, useEffect, createContext } from 'react';
import api from '../api/messaging';
const log = require('loglevel');

export const MessagingContext = createContext({
  user: {},
  messages: [],
  authors: [],
  isLoading: false,
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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  // useEffect(() => {
  //   loadRegions();
  //   loadAuthors();
  // }, []);

  useEffect(() => {
    log.debug('load author avatars');
    if (authors.length) {
      Promise.all(
        authors.map(async (author) => {
          const { grower_accounts } = await api.getAuthorAvatar(author.handle);
          return { ...author, avatar: grower_accounts[0]?.image_url || '' };
        })
      ).then((data) => {
        setAuthors(data);
      });
    }
  }, [authors.length]);

  useEffect(() => {
    console.log('add avatars to threads');
    const withAvatars = messages.map((message) => {
      const author = authors.find(
        (author) => author.handle === message.userName
      );
      const avatar = author?.avatar || '';

      return { ...message, avatar };
    });
    setMessages(withAvatars);
  }, [messages.length, authors]);

  const groupMessageByHandle = (rawMessages) => {
    // make key of recipients name and group messages together
    // log.debug('rawMessages', rawMessages);
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
        } else if (
          message.type === 'survey' ||
          message.type === 'survey_response'
        ) {
          let key = message.survey.id;
          if (!grouped[key]) {
            grouped[key] = [message];
          }
          if (message.type === 'survey_response') {
            grouped[key].push(message);
          }
        } else if (message.type === 'announce') {
          // add date to create unique key for similar announements
          let key = `${message.subject}-${Date.now()}`;
          grouped[key] = [message];
        }
        return grouped;
      }, {});
    const filteredMessages = [
      ...Object.entries(newMessages)
        .map(([key, val]) => {
          if (key && val) {
            return {
              userName: key,
              messages: val,
            };
          }
        })
        .sort(
          (a, b) =>
            new Date(b.messages.at(-1).composed_at) -
            new Date(a.messages.at(-1).composed_at)
        ),
    ];
    setMessages(filteredMessages);
    setIsLoading(false);
  };

  const loadAuthors = async () => {
    const res = await api.getAuthors();

    if (res.authors) {
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
    console.log('postMessageSend payload', payload);
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
    if (res.error) {
      setErrorMessage(res.message);
      return;
    }

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
    isLoading,
    errorMessage,
    setErrorMessage,
    setIsLoading,
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
