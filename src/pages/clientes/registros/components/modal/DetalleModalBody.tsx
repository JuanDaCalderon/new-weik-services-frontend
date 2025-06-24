import {memo, ReactNode} from 'react';
import {Card} from 'react-bootstrap';
import {Registros} from '@/types';
import SimpleBar from 'simplebar-react';
import ComentarioForm from './ComentarioForm';
import logoTemp from '@/assets/images/logo.png';

type Message = {
  id: number;
  userPic?: string;
  userName: string;
  text: string;
  postedOn: string;
};

const messages: Message[] = [
  {
    id: 1,
    userPic: logoTemp,
    userName: 'Geneva',
    text: 'Hello!',
    postedOn: '10:00'
  },
  {
    id: 2,
    userPic: logoTemp,
    userName: 'Dominic',
    text: 'Hi, How are you? What about our next meeting?',
    postedOn: '10:01'
  },
  {
    id: 3,
    userPic: logoTemp,
    userName: 'Geneva',
    text: 'Yeah everything is fine',
    postedOn: '10:02'
  },
  {
    id: 4,
    userPic: logoTemp,
    userName: 'Dominic',
    text: "Wow that's great!",
    postedOn: '10:03'
  },
  {
    id: 5,
    userPic: logoTemp,
    userName: 'Dominic',
    text: 'Cool!',
    postedOn: '10:03'
  },
  {
    id: 6,
    userPic: logoTemp,
    userName: 'Juan',
    text: 'un super comentario',
    postedOn: '10:09'
  }
];

const ChatItemAvatar = ({userAvatar, postedOn}: {userAvatar: string; postedOn: string}) => {
  return (
    <div className="chat-avatar">
      <img src={userAvatar} alt={userAvatar} />
      <i>{postedOn}</i>
    </div>
  );
};

const ChatItemText = ({userName, text}: {userName: string; text: string}) => {
  return (
    <div className="conversation-text">
      <div className="ctext-wrap">
        <i>{userName}</i>
        <p>{text}</p>
      </div>
    </div>
  );
};

const ChatItem = ({children, placement, className}: {children: ReactNode; placement: string; className?: string}) => {
  return <li className={`clearfix ${placement === 'left' ? 'odd' : ''} ${className ? className : ''}`}>{children}</li>;
};

const DetalleModalBody = memo(function DetalleModalBody({registro}: {registro: Registros}) {
  console.log('🚀 ~ DetalleModalBody ~ registro:', registro);
  return (
    <Card className="m-0 p-0 shadow">
      <Card.Body className="p-1">
        <div className="d-flex flex-column gap-2 w-100 h-100">
          <div className="d-flex">
            <SimpleBar style={{maxHeight: '40vh', width: '100%'}}>
              <ul className="conversation-list m-0 p-0">
                {(messages || []).map((message, index) => {
                  return (
                    <ChatItem key={index.toString()} placement={index > 0 ? (index % 2 === 0 ? '' : 'left') : 'right'}>
                      {message.userPic && <ChatItemAvatar userAvatar={message.userPic} postedOn={message.postedOn} />}
                      <ChatItemText userName={message.userName} text={message.text} />
                    </ChatItem>
                  );
                })}
              </ul>
            </SimpleBar>
          </div>
          <ComentarioForm />
        </div>
      </Card.Body>
    </Card>
  );
});

export default DetalleModalBody;
