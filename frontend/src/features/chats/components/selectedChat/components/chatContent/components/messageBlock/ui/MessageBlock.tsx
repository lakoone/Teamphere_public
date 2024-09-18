'use client';
import styles from './MessageBlock.module.scss';
import { User, UserType } from '@/entities/User';
import { UserRole } from '@/shared/components/UserRole';
import { Message } from '@/entities/message';
import { Time } from '@/shared/components/Time';
import React from 'react';
import { fileDTO } from '@/entities/file/types';

export type MessageBlockProps = {
  id: string;
  from: UserType;
  text: string;
  time: string;
  ownerPerspective: boolean;
  readers: number[];
  files: fileDTO[];
};

export const MessageBlock: React.FC<MessageBlockProps> = React.memo(
  (props: MessageBlockProps) => {
    const messageObjectString = JSON.stringify({
      messageID: props.id,
      authorID: props.from.id,
      time: props.time,
      readers: props.readers,
    });

    return (
      <div data-message={messageObjectString} className={styles.container}>
        {!props.ownerPerspective && (
          <div className={styles.image}>
            <User size={'messageAvatar'} user={props.from} />
          </div>
        )}

        <div
          className={`${styles.content} ${props.ownerPerspective && styles.owner}`}
        >
          {!props.ownerPerspective && (
            <div className={styles.from}>
              <h5>{props.from.profile.name}</h5>
              {props.from.profile.tag && (
                <UserRole
                  role={props.from.profile.tag}
                  size={'small'}
                  color={props.from.profile.tagColor || ''}
                />
              )}
            </div>
          )}
          <div
            style={props.ownerPerspective ? { justifyContent: 'flex-end' } : {}}
            className={styles.message}
          >
            <Message
              id={props.id}
              files={props.files}
              owner={props.ownerPerspective}
              text={props.text}
            />
            <Time date={props.time} timeFormat={'time'} size={'small'} />
          </div>
        </div>
      </div>
    );
  },
);
