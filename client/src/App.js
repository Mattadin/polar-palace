import React, { useState } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import Game from './pages/Game';
import Docs from './pages/Docs';

import { ChoiceContext } from './utils/Context';

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App({socket}) {

  const [userChoice, setUserChoice] = useState("penguin");

  return (
    <ApolloProvider client={client}>
      <ChoiceContext.Provider value={{userChoice, setUserChoice}}>
        <Router>
          <div className="">
            <Header />
            <div className="">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/game" element={<Game socket={socket} />} />
                <Route path="/docs" element={<Docs/>} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </ChoiceContext.Provider>
    </ApolloProvider>
  );
}

export default App;
