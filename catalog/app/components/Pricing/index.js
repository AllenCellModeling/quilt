/* Pricing */
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import TakeAction from 'components/TakeAction';
import scrollIntoView from 'utils/scrollIntoView';

export const width = 900;

const emailBody = `To get started, tell us about your team.%0D%0A
%0D%0A
Team size:%0D%0A
Team id (short alphabetical string e.g. "MegaCorp"):%0D%0A
Admin name:%0D%0A
Admin username:%0D%0A
Admin email:%0D%0A
Admin phone:%0D%0A
%0D%0A
Thanks. We'll get back to you right away.%0D%0A
`;

const Styler = styled.div`
  overflow: auto;
  max-width: ${width}px;

  .faint {
    opacity: 0.5;
  }

  table {
    background-color: #eee;
    color: black;
    table-layout: fixed;
    text-align: left;
    width: ${width}px;
  }

  td {
    font-size: .8em;
    border: 1px solid white;
    font-weight: lighter;
    padding: 16px;
    vertical-align: top;
  }

  td .unit {
    font-size: .8em;
    opacity: 0.5;
  }

  tr.price h2 {
    font-size: 1.5em;
  }

  th {
    border: 1px solid white;
    font-size: 1.5em;
    font-weight: lighter;
    padding: 16px;
    text-align: left;
  }
`;

const Detail = styled.p`
  text-align: right;
`;

const perUser = <span className="unit">per user / month</span>;
const perMonth = <span className="unit">per month</span>;

function Pricing({ signUp, takeAction = true, title = 'Pricing' }) {
  return (
    <Styler>
      <h1 id="pricing" ref={scrollIntoView()}>{title}</h1>
      <table>
        <tbody>
          <tr>
            <th>Free</th>
            <th>Individual</th>
            <th>Team</th>
            <th>Enterprise</th>
          </tr>
          <tr className="price">
            <td>
              <h2>$0 { perUser }</h2>
            </td>
            <td>
              <h2>$7 { perUser }</h2>
            </td>
            <td>
              <h2>$990 { perMonth }</h2>
              <a href="https://aws.amazon.com/marketplace/pp/B07GDSGJ3S?qid=1547780653840">Buy now</a> on AWS Marketplace
            </td>
            <td>
              <h2>
                <a href={`mailto:sales@quiltdata.io?Subject=Quilt%20Enterprise&body=${emailBody}`} target="_top" >
                  Contact us
                </a>
              </h2>
            </td>
          </tr>
          <tr>
            <td>
              • Unlimited public packages<br />
            </td>
            <td>
              • Unlimited public packages<br />
              • Up to 1TB of private packages<br />
            </td>
            <td>
              • Unlimited public packages<br />
              • 1TB and up of private packages<br />
              • Admin and auditing features<br />
              • Dedicated web catalog<br />
            </td>
            <td>
              • Unlimited data storage<br />
              • Admin and auditing features<br />
              • Dedicated web catalog<br />
              • Priority support<br />
              • Custom SSO (LDAP, Active Directory, etc.)
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      {takeAction ? <TakeAction signUp={signUp} /> : null}
    </Styler>
  );
}

Pricing.propTypes = {
  signUp: PropTypes.bool,
  takeAction: PropTypes.bool,
  title: PropTypes.string,
};

export default Pricing;
