import React from 'react';
import { useSelector } from "react-redux";
import { selectCurrentChannelId, selectChannels } from "../../slices/channelsSlice";
import { selectMessages } from "../../slices/messagesSlice";
import { useTranslation } from "react-i18next";

export default function MessageHeader({filter}) {
  const channelsList = useSelector(selectChannels);
  const currentChennelId = useSelector(selectCurrentChannelId);
  const messages = useSelector(selectMessages);
  const { t } = useTranslation();

  const currentChennel = channelsList.find((c) => c.id == currentChennelId);
  const currentChannelMessages = messages.filter((message) => message.channelId == currentChennelId);

  return (
    <div className="bg-light p-3 shadow-sm small" style={{position:"sticky"}}>
      <p className="m-0"><b># {filter.clean(currentChennel.name)}</b></p>
      <span className="text-muted">
        {t('messagesWithCount', { count: currentChannelMessages.length })}
      </span>
    </div>
  );
}