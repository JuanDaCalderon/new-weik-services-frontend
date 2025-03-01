import {Row, Col, Card, Button} from 'react-bootstrap';
import {PageBreadcrumb, Spinner} from '@/components';
import {extendedColorVariants} from '@/common';

const BorderedSpinners = () => {
  return (
    <Card>
      <Card.Body>
        <h4 className="mt-0 header-title">Border spinner</h4>
        <p className="text-muted mb-4">Use the border spinners for a lightweight loading indicator.</p>
        <Spinner />
      </Card.Body>
    </Card>
  );
};

const GrowingSpinners = () => {
  return (
    <Card>
      <Card.Body>
        <h4 className="mt-0 header-title">Growing spinner</h4>
        <p className="text-muted mb-4">
          You can go for growing spinner as well. While it doesn’t technically spin, it does repeatedly grow!
        </p>
        <Spinner type="grow" />
      </Card.Body>
    </Card>
  );
};

const Variants = () => {
  return (
    <Card>
      <Card.Body>
        <h4 className="mt-0 header-title">Variants</h4>
        <p className="text-muted mb-4">
          All standard visual variants are available for both animation styles by setting the <code>variant</code>{' '}
          property.
        </p>

        {extendedColorVariants.map((color, index) => {
          return <Spinner key={index.toString()} className="m-2" color={color} />;
        })}

        {extendedColorVariants.map((color, index) => {
          return <Spinner key={index.toString()} className="m-2" type="grow" color={color} />;
        })}
      </Card.Body>
    </Card>
  );
};

const SpinnersSizes = () => {
  const sizes: ('lg' | 'md' | 'sm')[] = ['lg', 'md', 'sm'];

  return (
    <Card>
      <Card.Body>
        <h4 className="mt-0 header-title">Size</h4>
        <p className="text-muted mb-4">
          Add <code>size</code> attribute to make spinner with sizes including lg, md or sm.
        </p>
        <Row>
          {sizes.map((size, index) => {
            return (
              <div key={index.toString()} className="col-lg-6">
                <Spinner className="text-primary m-2" color="primary" size={size} />
                <Spinner className="text-secondary m-2" type="grow" size={size} />
              </div>
            );
          })}
          <Col lg={6}>
            <Spinner className="spinner-border-sm m-2" />
            <Spinner type="grow" className="spinner-grow-sm m-2" />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

const ButtonSpinners = () => {
  return (
    <Card>
      <Card.Body>
        <h4 className="mt-0 header-title">Buttons spinner</h4>
        <p className="text-muted mb-4">
          Use spinners within buttons to indicate an action is currently processing or taking place. You may also swap
          the text out of the spinner element and utilize button text as needed.
        </p>
        <Row>
          <Col lg={6}>
            <div className="button-list d-flex gap-1">
              <Button color="primary" disabled>
                <Spinner className="spinner-border-sm" tag="span" color="white" />
                <span className="visually-hidden">Loading...</span>
              </Button>

              <Button color="primary" disabled>
                <Spinner className="spinner-border-sm me-1" tag="span" color="white" />
                Loading...
              </Button>
            </div>
          </Col>
          <Col lg={6}>
            <div className="button-list d-flex gap-1">
              <Button color="primary" disabled>
                <Spinner className="spinner-grow-sm" tag="span" color="white" type="grow" />
                <span className="visually-hidden">Loading...</span>
              </Button>

              <Button color="primary" disabled>
                <Spinner className="spinner-grow-sm me-1" tag="span" color="white" type="grow" />
                Loading...
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

const SpinnersUI = () => {
  return (
    <>
      <PageBreadcrumb title="Spinners" subName="Base UI" />

      <Row>
        <Col xl={6}>
          <BorderedSpinners />
          <Variants />

          <Card>
            <Card.Body>
              <h4 className="mt-0 header-title">Alignment</h4>
              <p className="text-muted mb-4">
                Use flexbox utilities, float utilities, or text alignment utilities to place spinners exactly where you
                need them in any situation.
              </p>
              <div className="d-flex justify-content-center">
                <Spinner />
              </div>
            </Card.Body>
          </Card>

          <SpinnersSizes />
        </Col>

        <Col xl={6}>
          <GrowingSpinners />

          <Card>
            <Card.Body>
              <h4 className="mt-0 header-title">Placement</h4>
              <p className="text-muted mb-4">
                Use <code>flexbox utilities</code>, <code>float utilities</code>, or
                <code>text alignment</code> utilities to place spinners exactly where you need them in any situation.
              </p>
              <div className="d-flex align-items-center">
                <strong>Loading...</strong>
                <Spinner className="ms-auto" />
              </div>
            </Card.Body>
          </Card>

          <ButtonSpinners />
        </Col>
      </Row>
    </>
  );
};

export default SpinnersUI;
