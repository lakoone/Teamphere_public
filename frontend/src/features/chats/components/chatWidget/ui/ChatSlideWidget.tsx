'use client';
import styles from './ChatSlideWidget.module.scss';
import { BorderLinearProgress } from '@/shared/components/Taskbar';
import {
  Badge,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { CalendarDayPicker } from '@/shared/components/CalendarDayPicker';
import React, { useState } from 'react';
import ArrowRightIcon from '@/shared/icons/ArrowRightIcon';
import TaskIcon from '@/shared/icons/TaskIcon';
import AddIcon from '@/shared/icons/AddIcon';
import { useTranslations } from 'next-intl';
import { SideWidget } from '@/shared/components/SideWidget';
import { CreateTask } from '@/entities/task/components/createTask/ui/CreateTask';
import { useAppSelector } from '@/utils/hooks/reduxHook';
import { TaskType } from '@/entities/task/types/TaskType';
import { TaskCard } from '@/entities/task/components/taskCard/ui/TaskCard';
import { useSelectedDate } from '@/features/calendar/ui/context/CalendarProvider';
import dayjs from 'dayjs';
import { useChatOpen } from '@/features/chats/context/ChatOpenContext';
export const ChatSlideWidget: React.FC = () => {
  const selectedChatID = useAppSelector(
    (state) => state.selectedChat.selectedChat.id,
  );
  const selectedChatName = useAppSelector(
    (state) => state.selectedChat.selectedChat.name,
  );
  const userName = useAppSelector((state) => state.user.profile.name);
  const [createTaskOpen, setCreateTaskOpen] = useState<boolean>(false);
  const [opened, setOpened] = useState(false);
  const { SelectedDate } = useSelectedDate();
  const tasks = useAppSelector((state) => state.tasks.tasksForMe);
  const t = useTranslations('MessagePage');
  const chatTasks: TaskType[] = tasks.filter(
    (task) => task.chatID === selectedChatID,
  );
  const chatTasksToDo: TaskType[] = chatTasks.filter(
    (task) => task.status !== 'verified',
  );
  const completedTasks: TaskType[] = chatTasks.filter(
    (task) => task.status === 'verified',
  );

  const sortedTasks = chatTasksToDo
    .filter((task) => {
      const deadline = dayjs(task.deadline);
      const selected = dayjs(SelectedDate);
      return deadline.isSame(selected, 'day');
    })
    .sort((a, b) => {
      if (dayjs(a.deadline).isBefore(dayjs(b.deadline))) return -1;
      if (dayjs(a.deadline).isAfter(dayjs(b.deadline))) return 1;
      return 0;
    });
  const handleOpenClick = () => {
    setOpened((perv) => !perv);
  };
  const { isTaskWidgetOpen, toggleTaskWidget } = useChatOpen();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const splitTitle = selectedChatName.split('|');
  const title = splitTitle.find((titleElement) => titleElement !== userName);
  return (
    <div
      style={
        (isSmallScreen ? !isTaskWidgetOpen : !opened)
          ? { cursor: 'pointer' }
          : {}
      }
      onClick={() => {
        if (isSmallScreen ? !isTaskWidgetOpen : !opened) {
          setOpened(true);
        }
      }}
      className={`${styles.container} ${(isSmallScreen ? !isTaskWidgetOpen : !opened) && styles.closeContainer} `}
    >
      <section className={styles.header}>
        <div
          className={`${styles.top} ${(isSmallScreen ? !isTaskWidgetOpen : !opened) && styles.center}`}
        >
          <Tooltip title={selectedChatName}>
            <Typography
              component={'h3'}
              variant="h6"
              className={`${
                (isSmallScreen ? !isTaskWidgetOpen : !opened) && styles.none
              }`}
            >
              {title}
            </Typography>
          </Tooltip>
          <Tooltip title={t('Widget')}>
            <IconButton
              sx={
                (isSmallScreen ? !isTaskWidgetOpen : !opened)
                  ? {
                      transition: '0.5s ease',
                      transform: 'rotate(180deg)',
                    }
                  : { transition: '0.5s ease' }
              }
              onClick={isSmallScreen ? toggleTaskWidget : handleOpenClick}
            >
              <ArrowRightIcon />
            </IconButton>
          </Tooltip>
        </div>

        <BorderLinearProgress
          NoText={isSmallScreen ? !isTaskWidgetOpen : !opened}
          total={chatTasks.length}
          completed={completedTasks.length}
        />
      </section>
      <section className={styles.content}>
        {(isSmallScreen ? isTaskWidgetOpen : opened) && <CalendarDayPicker />}

        <section className={styles.tasks}>
          <div
            className={`${styles.taskHeader} ${(isSmallScreen ? !isTaskWidgetOpen : !opened) && styles.center}`}
          >
            <Badge badgeContent={chatTasksToDo.length} color="warning">
              <TaskIcon />
            </Badge>
            {(isSmallScreen ? isTaskWidgetOpen : opened) && (
              <>
                <h3>{t('Tasks')}</h3>
                <SideWidget open={createTaskOpen} setOpen={setCreateTaskOpen}>
                  <CreateTask setOpen={setCreateTaskOpen} />
                </SideWidget>
                <IconButton onClick={() => setCreateTaskOpen(true)}>
                  <AddIcon />
                </IconButton>
              </>
            )}
          </div>
          {(isSmallScreen ? isTaskWidgetOpen : opened) && (
            <div className={styles.tasksContent}>
              {sortedTasks.map((task) => (
                <TaskCard key={task.id} task={task} size={'normal'} />
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  );
};
