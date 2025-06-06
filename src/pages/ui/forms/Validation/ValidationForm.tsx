import {Row, Col, Card, Button, InputGroup, Form} from 'react-bootstrap';
import {PageBreadcrumb} from '@/components';
import {useFormValidation} from '../hooks';

const FormValidationWithTooltip = () => {
  const {isValidated, handleSubmit} = useFormValidation();

  return (
    <Card>
      <Card.Body>
        <h4 className="header-title mb-3">Tooltips</h4>

        <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
          <Form.Group className="position-relative mb-3" controlId="validationTooltip01">
            <Form.Label>First name</Form.Label>
            <Form.Control required type="text" placeholder="First name" defaultValue="Mark" />
            <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="position-relative mb-3" controlId="validationTooltip02">
            <Form.Label>Last name</Form.Label>
            <Form.Control required type="text" placeholder="Last name" defaultValue="Otto" />
            <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="position-relative mb-3" controlId="validationCustonTooltipme">
            <Form.Label>Username</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
              <Form.Control type="text" placeholder="Username" aria-describedby="inputGroupPrepend" required />
              <Form.Control.Feedback type="invalid" tooltip>
                Please choose a username.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group className="position-relative mb-3" controlId="validationTooltip03">
            <Form.Label>City</Form.Label>
            <Form.Control type="text" placeholder="City" required />
            <Form.Control.Feedback type="invalid" tooltip>
              Please provide a valid city.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="position-relative mb-3" controlId="validationTooltip04">
            <Form.Label>State</Form.Label>
            <Form.Control type="text" placeholder="State" required />
            <Form.Control.Feedback type="invalid" tooltip>
              Please provide a valid state.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="position-relative mb-3" controlId="validationTooltip05">
            <Form.Label>Zip</Form.Label>
            <Form.Control type="text" placeholder="Zip" required />
            <Form.Control.Feedback type="invalid" tooltip>
              Please provide a valid zip.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="position-relative mb-3">
            <Form.Check required label="Agree to terms and conditions" feedback="You must agree before submitting." />
          </Form.Group>
          <Button type="submit">Submit form</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

const ValidationForm = () => {
  const {isValidated, handleSubmit} = useFormValidation();

  return (
    <>
      <PageBreadcrumb title="Validation Form" subName="Forms" />

      <Row>
        <Col lg={6}>
          <Card>
            <Card.Body>
              <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="validationCustom01">
                  <Form.Label>First name</Form.Label>
                  <Form.Control required type="text" placeholder="First name" defaultValue="Mark" />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="validationCustom02">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control required type="text" placeholder="Last name" defaultValue="Otto" />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="validationCustomUsername">
                  <Form.Label>Username</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                    <Form.Control type="text" placeholder="Username" aria-describedby="inputGroupPrepend" required />
                    <Form.Control.Feedback type="invalid">Please choose a username.</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3" controlId="validationCustom03">
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" placeholder="City" required />
                  <Form.Control.Feedback type="invalid">Please provide a valid city.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="validationCustom04">
                  <Form.Label>State</Form.Label>
                  <Form.Control type="text" placeholder="State" required />
                  <Form.Control.Feedback type="invalid">Please provide a valid state.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="validationCustom05">
                  <Form.Label>Zip</Form.Label>
                  <Form.Control type="text" placeholder="Zip" required />
                  <Form.Control.Feedback type="invalid">Please provide a valid zip.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    required
                    label="Agree to terms and conditions"
                    feedback="You must agree before submitting."
                  />
                </Form.Group>
                <Button type="submit">Submit form</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <FormValidationWithTooltip />
        </Col>
      </Row>
    </>
  );
};

export {ValidationForm};
