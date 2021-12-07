import React, { useState, createContext } from 'react';
import api from '../api/messaging';

export const MessagingContext = createContext({
  messages: [],
  regions: [],
  loadMessages: () => {},
  loadRegions: () => {},
  getRegion: () => {},
  postRegion: () => {},
  getRegionById: () => {},
  getMessage: () => {},
  postMessage: () => {},
  postMessageSend: () => {},
  handlerecipient: () => {},
  sendMessageFromGrowers: () => {},
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
        } else if (message.subject.includes('Announce')) {
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

  const loadMessages = async () => {
    const res = await api.getMessage(user.userName);

    if (res) {
      groupMessageByHandle(res.messages);
    }
  };

  const loadRegions = async () => {
    const res = await api.getRegion();

    if (res) {
      setRegions(res);
    }
  };

  const postRegion = async (payload) => {
    const res = await api.postRegion(payload);
    console.log(res, payload);
  };

  const getRegionById = async (id) => {
    await api.getRegionById(id);
    // console.log(res, region);
  };

  const postMessage = async (payload) => {
    const res = await api.postMessage(payload);
    console.log(res, payload);
  };

  const postMessageSend = async (payload) => {
    if (payload) {
      const res = await api.postMessageSend(payload);
      console.log(res);
    } else {
      return 'Were sorry something went wrong. Please try again.';
    }
  };

  const sendMessageFromGrowers = (payload) => {
    console.log('growerInfo', payload);
    let messageData = {
      author_id: user.id,
      subject: 'Message',
      from: user.userName,
      to: payload.phone ? payload.phone : payload.email,
      body: '',
      recipient_organization_id: payload.organizationId
        ? payload.organizationId
        : '',
      recipient_id: payload.id,
    };

    // check if messages already exist
    let checkExisting = messages.find((message) => message.to === payload.to);
    if (!checkExisting) {
      setGrowerMessage(messageData);
    }
    console.log(growerMessage);
  };

  const value = {
    user,
    messages,
    regions,
    loadMessages,
    loadRegions,
    postRegion,
    getRegionById,
    postMessage,
    postMessageSend,
    sendMessageFromGrowers,
  };

  return (
    <MessagingContext.Provider value={value}>
      {props.children}
    </MessagingContext.Provider>
  );
};
