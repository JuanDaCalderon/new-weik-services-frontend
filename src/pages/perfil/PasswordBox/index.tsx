import {Spinner} from '@/components';
import {memo} from 'react';
import {Card, InputGroup, Form, Button} from 'react-bootstrap';
import usePassword from './usePassword';

const PasswordBox = memo(function PasswordBox() {
  const {isLoading, handleInputChange, isFormChanged, passwordForm, setShowPassword, showPassword, updateNewPassword} =
    usePassword();

  return (
    <Card>
      <Card.Body>
        <div className="text-start position-relative">
          <Form.Label className="text-dark cursor-pointer mb-0 mt-1" htmlFor="password">
            <strong>Nueva contraseña:</strong>
          </Form.Label>
          <InputGroup className="mb-0">
            <Form.Control
              id="password"
              size="sm"
              type={showPassword ? 'text' : 'password'}
              onChange={handleInputChange}
              autoComplete="current-password"
              name="password"
              value={passwordForm.password}
            />
            <div
              className={`input-group-text input-group-password py-0 px-2 ${showPassword ? 'show-password' : ''}`}
              data-password={showPassword ? 'true' : 'false'}>
              <span
                className="password-eye"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}></span>
            </div>
          </InputGroup>
          <Form.Label className="text-dark cursor-pointer mb-0 mt-1" htmlFor="confirmPassword">
            <strong>Confirmar contraseña:</strong>
          </Form.Label>
          <InputGroup className="mb-0">
            <Form.Control
              id="confirmPassword"
              size="sm"
              type={showPassword ? 'text' : 'password'}
              onChange={handleInputChange}
              autoComplete="current-password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
            />
            <div
              className={`input-group-text input-group-password py-0 px-2 ${showPassword ? 'show-password' : ''}`}
              data-password={showPassword ? 'true' : 'false'}>
              <span
                className="password-eye"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}></span>
            </div>
          </InputGroup>
          <Button
            className="w-100 mt-2"
            variant="primary"
            disabled={!isFormChanged || isLoading}
            onClick={updateNewPassword}>
            {isLoading && <Spinner className="spinner-border-sm" tag="span" color="white" />}
            {!isLoading && 'Actualizar contraseña'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
});

export default PasswordBox;
