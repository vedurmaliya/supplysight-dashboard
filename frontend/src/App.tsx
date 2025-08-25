import React, { useState } from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import Dashboard from './components/Dashboard';

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-gray-50">
        <Dashboard />
      </div>
    </ApolloProvider>
  );
}

export default App;
