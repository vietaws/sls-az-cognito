import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify, API, Auth } from 'aws-amplify';

Amplify.configure({
  aws_project_region: 'ap-southeast-1',
  aws_cognito_region: 'ap-southeast-1',
  aws_user_pools_id: 'ap-southeast-1_3wnN7tvPg',
  aws_user_pools_web_client_id: '1qml9fu7pm6ldakp7l3v624crn',
  aws_mandatory_sign_in: 'enable',
  aws_cloud_logic_custom: [
    {
      name: 'api-sls',
      endpoint:
        'https://0meeqilvb0.execute-api.ap-southeast-1.amazonaws.com/dev',
      region: 'ap-southeast-1',
    },
  ],
});

export default function Home() {
  const getUserData = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const idToken = user.signInUserSession.idToken.jwtToken;
    console.log('idToken: ', idToken);
    const requestHeader = {
      headers: {
        Authorization: idToken,
      },
      body: {
        email: user.attributes.email,
        name: user.attributes.name,
        age: 18,
      },
    };
    const data = await API.post('api-sls', '/hello', requestHeader);
    console.log('Data: ', data);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>VietAWS | Serverless Tutorials</h1>
      <Authenticator
        loginMechanisms={['email']}
        signUpAttributes={['name']}
        socialProviders={['amazon', 'apple', 'facebook', 'google']}
      >
        {({ signOut, user }) => (
          <main>
            <h1>
              Hello {user.attributes.name} - {user.attributes.email}
            </h1>
            <p>Secret message</p>
            <button onClick={getUserData}>Call API</button>
            <br />
            <button onClick={signOut}>Sign out</button>
          </main>
        )}
      </Authenticator>
    </div>
  );
}
