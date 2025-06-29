import {memo, ReactNode, useMemo, useState} from 'react';
import {Card, Image} from 'react-bootstrap';
import {Registros} from '@/types';
import SimpleBar from 'simplebar-react';
import ComentarioForm from './ComentarioForm';
import logoTemp from '@/assets/images/logo.png';
import {Comentario} from '@/types';
import {useAppSelector} from '@/store';
import {selectEmployees} from '@/store/selectores';
import {DateUtils, getNombreCompletoUser} from '@/utils';
import {SkeletonLoader} from '@/components/SkeletonLoader';

const ChatItemAvatar = memo(function ChatItemAvatar({userAvatar, postedOn}: {userAvatar: string; postedOn: string}) {
  const [hasLoad, setHasLoad] = useState<boolean>(false);
  return (
    <div className="chat-avatar d-flex flex-column align-items-center justify-content-center gap-1">
      {!hasLoad && <SkeletonLoader width="100%" height="45px" customClass="p-0" />}
      <Image
        fluid
        loading="lazy"
        src={userAvatar}
        alt={userAvatar}
        className="w-50 object-fit-cover ratio-1x1"
        onLoad={() => setHasLoad(true)}
      />
      <span className="text-muted font-10 lh-sm">{postedOn}</span>
    </div>
  );
});

const ChatItemText = memo(function ChatItemText({userName, text}: {userName: string; text: string}) {
  return (
    <div className="conversation-text">
      <div className="ctext-wrap">
        <h6 className="p-0 m-0 font-12 text-uppercase fw-bold text-muted">{userName}</h6>
        <p>{text}</p>
      </div>
    </div>
  );
});

const ChatItem = memo(function ChatItem({
  children,
  placement,
  className
}: {
  children: ReactNode;
  placement: string;
  className?: string;
}) {
  return (
    <li className={`clearfix mb-2 w-100 h-100 ${placement === 'left' ? 'odd' : ''} ${className ? className : ''}`}>
      {children}
    </li>
  );
});

const DetalleModalBody = memo(function DetalleModalBody({
  registro,
  registerType
}: {
  registro: Registros;
  registerType: string;
}) {
  const users = useAppSelector(selectEmployees);
  const comments: Comentario[] = useMemo(() => {
    return (
      registro.comentarios.reduce((acc, comment) => {
        const user = users.find((u) => u.id === comment.createdBy);
        if (user) {
          acc.push({
            userPic: user.userImage || logoTemp,
            userName: getNombreCompletoUser(user),
            text: comment.comentario,
            postedOn: DateUtils.formatShortDate(DateUtils.parseStringToDate(comment.createdAt) || new Date(), true)
          });
          return acc;
        } else return acc;
      }, [] as Comentario[]) || []
    );
  }, [registro.comentarios, users]);

  return (
    <Card className="m-0 p-0 shadow">
      <Card.Body className="p-1">
        <div className="d-flex flex-column gap-2">
          <div className="d-flex">
            <SimpleBar style={{maxHeight: '40vh', width: '100%'}}>
              <ul className="conversation-list m-0 p-0">
                {comments.map((comment, i) => {
                  return (
                    <ChatItem key={i.toString()} placement={i > 0 ? (i % 2 === 0 ? '' : 'left') : 'right'}>
                      {comment.userPic && <ChatItemAvatar userAvatar={comment.userPic} postedOn={comment.postedOn} />}
                      <ChatItemText userName={comment.userName} text={comment.text} />
                    </ChatItem>
                  );
                })}
              </ul>
            </SimpleBar>
          </div>
          <ComentarioForm registro={registro} registerType={registerType} />
        </div>
      </Card.Body>
    </Card>
  );
});

export default DetalleModalBody;
