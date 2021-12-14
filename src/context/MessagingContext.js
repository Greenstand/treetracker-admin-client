import React, { useState, createContext } from 'react';
import api from '../api/messaging';

export const MessagingContext = createContext({
  user: {},
  messages: [],
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
  const [growerMessage, setGrowerMessage] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));

  const groupMessageByHandle = (rawMessages) => {
    // make key of recipients name and group messages together
    let newMessages = rawMessages
      .sort((a, b) => (a.composed_at < b.composed_at ? -1 : 1))
      .reduce((grouped, message) => {
        if (message.subject === 'Message') {
          let key =
            message.to !== user.userName ? message[`to`] : message['from'];
          if (key) {
            if (!grouped[key] && !messages[key]) {
              grouped[key] = [];
            }
            grouped[key].push(message);
          }
        } else if (message.subject === 'Survey') {
          let key = message.survey.title;
          if (grouped[key]) {
            if (grouped[key].survey.id === message.survey.id) {
              return;
            } else {
              grouped[key] = [];
            }
          } else {
            grouped[key] = [];
          }
          grouped[key].push(message);
        } else if (message.subject === 'Announce Message') {
          let key =
            message.to !== user.userName ? message[`to`] : message['from'];
          if (key) {
            if (!grouped[key] && !messages[key]) {
              grouped[key] = [];
            }
            grouped[key].push(message);
          }
        }
        return grouped;
      }, {});
    setMessages([
      ...Object.entries(newMessages).map(([key, val]) => {
        if (key && val) {
          return {
            userName: key,
            messages: val,
          };
        }
      }),
    ]);
  };

  const postRegion = async (payload) => {
    await api.postRegion(payload);
  };

  const getRegionById = async (id) => {
    await api.getRegionById(id);
  };

  const postMessage = async (payload) => {
    await api.postMessage(payload);
  };

  const postMessageSend = async (payload) => {
    if (payload) {
      await api.postMessageSend(payload);
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
    const res = await api.getMessage(user.userName);

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
    regions,
    sendMessageFromGrower,
    loadMessages,
    loadRegions,
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
