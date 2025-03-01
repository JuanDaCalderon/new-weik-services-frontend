import {Card} from 'react-bootstrap';
import classNames from 'classnames';
import {CardTitle} from '@/components';
import {LeadItem} from './types';

type LeadsProps = {
  recentLeads: LeadItem[];
};

const Leads = ({recentLeads}: LeadsProps) => {
  return (
    <Card>
      <Card.Body>
        <CardTitle
          containerClass="d-flex align-items-center justify-content-between mb-3"
          title="Recent Leads"
          menuItems={[{label: 'Settings'}, {label: 'Action'}]}
        />

        {(recentLeads || []).map((item, index) => {
          return (
            <div
              key={index.toString()}
              className={classNames('d-flex', 'align-items-start', {
                'mt-3': index !== recentLeads.length
              })}>
              <img className="me-3 rounded-circle" src={item.profile} width="40" alt="Generic placeholder" />
              <div className="w-100 overflow-hidden">
                <span
                  className={classNames('badge', 'float-end', {
                    'badge-warning-lighten': item.status === 'Cold',
                    'badge-danger-lighten': item.status === 'Lost',
                    'badge-success-lighten': item.status === 'Won'
                  })}>
                  {item.status} lead
                </span>
                <h5 className="mt-0 mb-1">{item.name}</h5>
                <span className="font-13">{item.email}</span>
              </div>
            </div>
          );
        })}
      </Card.Body>
    </Card>
  );
};

export default Leads;
