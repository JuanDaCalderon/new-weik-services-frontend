import {memo, ReactNode, useCallback, useMemo, useState, ChangeEvent, KeyboardEvent, MouseEvent} from 'react';
import {Button, Card, Form, Image} from 'react-bootstrap';
import {Registros} from '@/types';
import SimpleBar from 'simplebar-react';
import ComentarioForm from './ComentarioForm';
import logoTemp from '@/assets/images/logo-sm.png';
import {Comentario} from '@/types';
import {useAppSelector} from '@/store';
import {selectEmployees} from '@/store/selectores';
import {DateUtils, getNombreCompletoUser} from '@/utils';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import useUpdateRegistros from '@/endpoints/db/registros/useUpdateRegistros';
import {useParams} from 'react-router-dom';

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

type FormControlElement = HTMLInputElement | HTMLTextAreaElement;
const DetalleModalBody = memo(function DetalleModalBody({
  registro,
  registerType
}: {
  registro: Registros;
  registerType: string;
}) {
  const originalValue = registro.link || '';
  const id = registro.id;
  const [inputValue, setInputValue] = useState<string>(originalValue);
  const [hasClicked, setHasClicked] = useState<boolean>(false);
  const [disabledHover, setDisabledHover] = useState<boolean>(true);
  const {cliente} = useParams<{cliente: string}>();
  const users = useAppSelector(selectEmployees);
  const {isUpdatingRegistro, updateRegistroPerClienteType} = useUpdateRegistros();
  const handleUpdate = useCallback(
    async (e: ChangeEvent<FormControlElement> | KeyboardEvent<FormControlElement> | MouseEvent<FormControlElement>) => {
      setHasClicked(false);
      const target = e.target as FormControlElement;
      if (target.value === originalValue) return;
      if (!cliente) return;
      await updateRegistroPerClienteType(cliente, registerType, id, {[target.name]: target.value});
    },
    [cliente, id, originalValue, registerType, updateRegistroPerClienteType]
  );
  const onMouseEnter = useCallback(() => setDisabledHover(false), []);
  const onMouseLeave = useCallback(() => setDisabledHover(true), []);
  const onClick = useCallback(() => setHasClicked(true), []);
  const onDispatchAction = useCallback(
    (e: ChangeEvent<FormControlElement> | KeyboardEvent<FormControlElement> | MouseEvent<FormControlElement>) => {
      const target = e.target as FormControlElement;
      if (hasClicked && target.value !== originalValue) handleUpdate(e);
    },
    [handleUpdate, hasClicked, originalValue]
  );
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
        <div
          className="w-100 h-100 d-flex align-items-center mb-1"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}>
          {isUpdatingRegistro ? (
            <SkeletonLoader customClass="p-0 top-0 w-100" height="29px" />
          ) : (
            <div className="w-100 h-100 d-flex flex-column">
              <Form.Label className="mb-1 text-muted lh-1">Link</Form.Label>
              <div className="h-100 w-100 d-flex align-items-center">
                <Form.Control
                  type="url"
                  pattern="https://.*"
                  value={inputValue}
                  name="link"
                  disabled={disabledHover}
                  onChange={(e) => setInputValue(e.target.value)}
                  onClick={onClick}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onDispatchAction(e);
                    } else if (e.key === 'Escape') {
                      setInputValue(originalValue);
                      setHasClicked(false);
                    }
                  }}
                  onMouseLeave={onDispatchAction}
                  onBlurCapture={onDispatchAction}
                />
                <Button
                  id="link"
                  as="a"
                  href={registro.link || ''}
                  target="_blank"
                  variant="outline-light py-0 px-1 d-flex align-items-center justify-content-center"
                  className=" border-0 ms-1">
                  <i className="uil-external-link-alt" />
                </Button>
              </div>
            </div>
          )}
        </div>
        <hr className="mt-1 mb-2" />
        <div className="d-flex flex-column gap-1">
          <Form.Label className="mb-1 text-muted lh-1">Comentarios</Form.Label>
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
