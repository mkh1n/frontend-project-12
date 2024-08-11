import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectCurrentChannelId, selectChannels } from '../../slices/channelsSlice';
import { selectMessages } from '../../slices/messagesSlice';

const MessageHeader = ({ filter }) => {
  const channelsList = useSelector(selectChannels);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const messages = useSelector(selectMessages);
  const { t } = useTranslation();

  const currentChannel = channelsList.find((c) => c.id === currentChannelId);
  const currentChannelMessages = messages.filter((message) => message.channelId === currentChannelId);

  return (
    <div className='bg-light p-3 shadow-sm small' style={{ position: 'sticky' }}>
      <p className='m-0'>
        <b># {filter.clean(currentChannel.name)}</b>
      </p>
      <span className='text-muted'>
        {t('messagesWithCount', { count: currentChannelMessages.length })}
      </span>
    </div>
  );
};

export default MessageHeader;
