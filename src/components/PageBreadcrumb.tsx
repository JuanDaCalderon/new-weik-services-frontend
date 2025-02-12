import {ReactNode, memo} from 'react';
import {Row, Col, Breadcrumb} from 'react-bootstrap';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';

type PageTitleProps = {
  title: string;
  subName?: string;
  children?: ReactNode;
};

const PageBreadcrumb = ({title, children}: PageTitleProps) => {
  return (
    <>
      <Helmet>
        <title>{title} | Weik - Crafting your vision</title>
      </Helmet>
      <Row>
        <Col>
          <div className="page-title-box py-1">
            <div className="page-title-right mt-2">
              <Breadcrumb listProps={{className: 'm-0 p-0'}}>
                <Breadcrumb.Item linkAs={'span'} as={'li'}>
                  <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item as={'li'} active>
                  {title}
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <h4 className="page-title text-dark text-opacity-75">
              {title}
              {children ?? null}
            </h4>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default memo(PageBreadcrumb);
