import React, { useState, useEffect, createContext } from 'react';
import api from '../api/messaging';
const log = require('loglevel');

export const MessagingContext = createContext({
  user: {},
  threads: [],
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
  const [threads, setThreads] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [growerMessage, setGrowerMessage] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    log.debug('...add avatars to threads');
    if (threads.length) {
      const withAvatars = threads.map((message) => {
        const author = authors.find(
          (author) => author.handle === message.userName
        );
        const avatar = author?.avatar || '';

        return { ...message, avatar };
      });
      setThreads(withAvatars);
    }
  }, [threads.length, authors]);

  const groupMessageByHandle = (rawMessages) => {
    log.debug('...group messages by handle');
    // make key of recipients name and group messages together
    // log.debug('rawMessages', rawMessages);
    let newMessages = rawMessages
      .sort((a, b) => (a.composed_at < b.composed_at ? -1 : 1))
      .reduce((grouped, message) => {
        if (message.type === 'message') {
          let key = message.to !== user.userName ? message.to : message.from;
          if (key) {
            if (!grouped[key]) {
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
            new Date(b?.messages?.at(-1).composed_at) -
            new Date(a?.messages?.at(-1).composed_at)
        ),
    ];
    setThreads(filteredMessages);
    setIsLoading(false);
  };

  const loadAuthors = async () => {
    log.debug('...load authors');
    const res = await api.getAuthors();

    if (res.authors) {
      let result = res.authors.filter(
        (author) => author.author_handle !== user.userName
      );

      log.debug('...load author avatars');
      if (result.length) {
        Promise.all(
          result.map(async (author) => {
            const { grower_accounts } = await api.getAuthorAvatar(
              author.handle
            );
            // log.debug('grower_accounts', grower_accounts[0]?.image_url);
            return { ...author, avatar: grower_accounts[0]?.image_url || '' };
          })
        ).then((data) => {
          // log.debug('...update authors with avatars', data);
          setAuthors(data);
        });
      }
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
      to: grower.phone ? grower.phone : grower.email,
    };

    if (payload.to) {
      setGrowerMessage(payload);
    }
  };

  const loadMessages = async () => {
    log.debug('...load messages');
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
    log.debug('...load regions');
    const res = await api.getRegion();

    if (res) {
      setRegions(res);
    }
  };

  const value = {
    user,
    threads,
    authors,
    regions,
    isLoading,
    errorMessage,
    setThreads,
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
