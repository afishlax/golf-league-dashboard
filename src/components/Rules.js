import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

function Rules() {
  return (
    <Row>
      <Col lg={8} className="mx-auto">
        <Card>
          <Card.Header as="h4">Winter Golf League 2026 - Rules & Information</Card.Header>
          <Card.Body>
            <h5>League Format</h5>
            <ul>
              <li><strong>Format:</strong> 2 Man Scramble x 9 Holes</li>
              <li><strong>Buy-In:</strong> $150 per Team ($75 per Person)</li>
              <li><strong>Payment Due:</strong> October 31st</li>
              <li><strong>Payment Methods:</strong> Venmo: Mason-coffee-1 / Cash / Check</li>
              <li><strong>Scoring:</strong> Cumulative score throughout the season</li>
            </ul>

            <hr className="my-4" />

            <h5>Hours of Play</h5>
            <ul>
              <li><strong>Monday:</strong> 8:00 AM - 5:00 PM</li>
              <li><strong>Tuesday:</strong> 8:00 AM - 5:00 PM</li>
              <li><strong>Wednesday:</strong> 8:00 AM - 5:00 PM</li>
              <li><strong>Thursday:</strong> 8:00 AM - 5:00 PM</li>
              <li><strong>Friday:</strong> 8:00 AM - 3:00 PM</li>
            </ul>

            <hr className="my-4" />

            <h5>General Rules</h5>
            <ul>
              <li><strong>Scheduling:</strong> All scheduling is to be done on the online Excel. YOU ARE RESPONSIBLE FOR SCHEDULING YOURSELF!</li>
              <li><strong>Equipment:</strong> Bring your own CLEAN clubs to play with</li>
              <li><strong>Balls:</strong> Balls will be provided. If you would like to use your own ball, it must be brand new</li>
              <li><strong>Beverages:</strong> DBA will provide some beer, but please BYOB as much as possible</li>
              <li><strong>No Breakfast Balls or Mulligans</strong></li>
              <li><strong>Gimme Putts:</strong> 10 FT Gimme</li>
              <li><strong>Maximum Players:</strong> Maximum of 2 teams playing at the same time</li>
            </ul>

            <hr className="my-4" />

            <h5>Tee Assignments</h5>
            <ul>
              <li><strong>Men:</strong> White Tees</li>
              <li><strong>Women:</strong> Red Tees</li>
              <li><strong>Old Farts (65+):</strong> Yellow Tees</li>
              <li><strong>Over 300 Drivers:</strong> Black Tees</li>
            </ul>

            <hr className="my-4" />

            <h5>Substitutions & Penalties</h5>
            <ul>
              <li><strong>Substitutes:</strong> Subs are allowed</li>
              <li><strong>No Show Penalty:</strong> No show / No Sub for the TEAM will be a +5 Penalty for the week</li>
            </ul>

            <hr className="my-4" />

            <h5>Prizes</h5>
            <ul>
              <li><strong>1st Place:</strong> $450</li>
              <li><strong>2nd Place:</strong> $300</li>
              <li><strong>3rd Place:</strong> $150</li>
            </ul>

            <hr className="my-4" />

            <h5>Special Events</h5>
            <ul>
              <li><strong>End of Year Awards:</strong> TBA</li>
              <li><strong>Master Party:</strong> April 10th</li>
            </ul>

            <div className="text-center mt-4 text-muted">
              <small>Last updated: {new Date().toLocaleDateString()}</small>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Rules;
