import {memo, ReactNode, useMemo} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {Cliente, Registros} from '@/types';
import SimpleBar from 'simplebar-react';
import ComentarioForm from './ComentarioForm';
import logoTemp from '@/assets/images/logo.png';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {useAppSelector} from '@/store';
import {selectClientes, selectRegistrosByClienteYTipo} from '@/store/selectores';
import {AgregarRegistros} from '@/pages/clientes/registros/components/AgregarRegistros';

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

const DetalleModalBody = memo(function DetalleModalBody({
  registro,
  registerType
}: {
  registro: Registros;
  registerType: string;
}) {
  const {cliente} = useParams<{cliente: string}>();
  const clientes = useAppSelector(selectClientes);
  const {tiposRegistros} = useMemo(() => {
    return clientes.find((c) => c.domain === cliente) || ({tiposRegistros: []} as unknown as Cliente);
  }, [cliente, clientes]);
  const selectRegistros = useMemo(() => {
    if (!cliente) return null;
    return selectRegistrosByClienteYTipo(cliente, registerType);
  }, [cliente, registerType]);
  const {registros, isLoading} = useSelector(selectRegistros || (() => ({registros: [], isLoading: false})));
  console.log('🚀 ~ registros, isLoading:', registros, isLoading);

  const customFields = useMemo(() => {
    return (
      tiposRegistros.find((tr) => tr.tipo.toLowerCase().trim() === registerType.toLowerCase().trim())?.customFields ||
      []
    );
  }, [registerType, tiposRegistros]);

  return (
    <>
      <Row>
        <Col className="d-flex align-content-center align-items-center justify-content-between pt-0 pb-1" xs={12}>
          <h5 className="fw-bold font-14 lh-1 p-0 m-0">Subregistro o ajustes de {registro.nombre}</h5>
          <div className="d-flex align-items-center flex-wrap justify-content-end gap-1">
            <AgregarRegistros cliente={cliente} registerType={registerType} customFields={customFields} isSubRegistro />
          </div>
        </Col>
        <Col xs={12}>
          <hr className="m-0 p-0" />
        </Col>
      </Row>
      <Card className="m-0 p-0 shadow">
        <Card.Body className="p-1">
          <div className="d-flex flex-column gap-2 w-100 h-100">
            <div className="d-flex">
              <SimpleBar style={{maxHeight: '40vh', width: '100%'}}>
                <ul className="conversation-list m-0 p-0">
                  {(messages || []).map((message, index) => {
                    return (
                      <ChatItem
                        key={index.toString()}
                        placement={index > 0 ? (index % 2 === 0 ? '' : 'left') : 'right'}>
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
    </>
  );
});

export default DetalleModalBody;
