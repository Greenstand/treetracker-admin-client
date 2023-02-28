import React, { useState, useEffect, createContext } from 'react';
import api from '../api/messaging';
const log = require('loglevel');
import { getOrganizationUUID } from './../api/apiUtils';

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
    try {
      const organizationId = getOrganizationUUID();
      log.debug('...load authors');
      const authors = await api.getAuthors(organizationId);
      setAuthors(authors);
    } catch (error) {
      log.debug(error);
      setErrorMessage(error.message);
    }
  };

  const postRegion = async (payload) => {
    try {
      return api.postRegion(payload);
    } catch (error) {
      log.debug(error);
      setErrorMessage(error.message);
    }
  };

  const getRegionById = async (id) => {
    try {
      return api.getRegionById(id);
    } catch (error) {
      log.debug(error);
      setErrorMessage(error.message);
    }
  };

  const postMessage = async (payload) => {
    try {
      return api.postMessage(payload);
    } catch (error) {
      log.debug(error);
      setErrorMessage(error.message);
    }
  };

  const postMessageSend = (payload) => {
    try {
      if (payload) {
        return api.postMessageSend(payload);
      } else {
        throw 'Were sorry something went wrong. Please try again.';
      }
    } catch (error) {
      log.debug(error);
      setErrorMessage(error.message);
    }
  };

  const postBulkMessageSend = (payload) => {
    try {
      if (payload) {
        return api.postBulkMessageSend(payload);
      } else {
        throw 'Whoops! There is something missing. Please check your message and try again';
      }
    } catch (error) {
      log.debug(error);
      setErrorMessage(error.message);
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
    try {
      log.debug('...load messages');
      const res = await api.getMessages(user.userName);
      if (!res.error) {
        // check if grower sent a message from GrowerDetail and add it to top of messages
        if (res && growerMessage) {
          groupMessageByHandle([growerMessage, ...res.messages]);
        } else {
          groupMessageByHandle(res.messages);
        }
      }
    } catch (error) {
      if (error.status === 404 && error.message === 'Author handle not found') {
        setErrorMessage(
          'Your user is not yet configured for messaging access. Please contact technical support.'
        );
      }
      throw 'Sorry, there was a problem loading your messages.';
    }
  };

  const loadRegions = async () => {
    try {
      log.debug('...load regions');
      const organizationId = getOrganizationUUID();
      log.debug('...load authors');
      const res = await api.getRegions(organizationId);

      if (res.error) {
        log.debug(res.error);
        throw 'Sorry, there was a problem loading your regions.';
      }

      if (res) {
        setRegions(res.regions);
      }
    } catch (error) {
      log.debug(error);
      setErrorMessage(error.message);
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
