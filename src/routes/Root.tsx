// Import the necessary libraries
import '@aws-amplify/ui-react/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Root.css';
import { useState, useEffect, useRef } from 'react';
import { Container, Spinner } from 'react-bootstrap';

// Amplify components
import { Authenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { fetchUserAttributes } from 'aws-amplify/auth';

// Custom components
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

import { Outlet } from 'react-router-dom';

const client = generateClient<Schema>();


function Root() {
  const [userAttributes, setUserAttributes] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      client.queries.sayHello({ name: "Amplify" }).then((data) => console.log(data));
      fetchUserAttributes().then((data) => {
        setUserAttributes(data);
        setLoading(false);
      });
      return;
    }
  }, []);

  return (
    <Authenticator>
      {({ signOut = () => {} }) => (
        <main>
          {loading ? (
            <Container fluid>
              <div className="position-absolute w-100 h-100 d-flex flex-column align-items-center bg-white justify-content-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            </Container>
          ) : (
            <>
              <Container fluid className="p-3">
                <NavBar username={userAttributes?.preferred_username} signOut={signOut} />
                <Outlet />
                <Footer />
              </Container>
            </>
          )}
        </main>
      )}
    </Authenticator>
  );
}

export default Root;
