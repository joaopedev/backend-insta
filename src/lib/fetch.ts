
import { ThreadsUserProfileResponse } from '../types/threads-api';
import { ENDPOINTS_DOCUMENT_ID, GRAPHQL_ENDPOINT, THREADS_APP_ID } from './consts';
import { mapUserProfile } from './map';

interface FetchBaseParams {
  documentId: number;
  variables: Record<string, any>;
}

interface FetchUserIdByNameParams {
  userName: string;
}

interface FetchUserProfileParams {
  userId?: string;
  userName?: string;
}


const fetchBase = ({ documentId, variables }: FetchBaseParams) => {
    return fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': 'Threads API midu client',
        'x-ig-app-id': THREADS_APP_ID,
        'x-fb-lsd': 'jdFoLBsUcm9h-j90PeanuC',
      },
      body: `lsd=jdFoLBsUcm9h-j90PeanuC&jazoest=21926&variables=${JSON.stringify(
        variables
      )}&doc_id=${documentId}`,
    }).then((response) => response.json());
  };

  const IS_DEBUG = process.env.IS_DEBUG;

  export const fetchUserIdByName = ({ userName }: FetchUserIdByNameParams) => {
    if (IS_DEBUG) console.info(`https://www.threads.net/@${userName}`);
  
    return fetch(`https://www.threads.net/@${userName}`, {
      headers: { 'sec-fetch-site': 'same-site' },
    })
      .then((res) => res.text())
      .then((html) => {
        const userId = html.match(/"user_id":"(\d+)"/)?.[1];
        return userId;
      });
  };

  export const fetchUserProfile = async ({
    userId,
    userName,
  }: FetchUserProfileParams) => {
    if (userName && !userId) {
      userId = await fetchUserIdByName({ userName });
    }
  
    const variables = { userID: userId };
    const data = (await fetchBase({
      variables,
      documentId: ENDPOINTS_DOCUMENT_ID.USER_PROFILE,
    })) as ThreadsUserProfileResponse;
  
    return mapUserProfile(data);
  };
  
  export const fetchUserProfileThreads = async ({
    userId,
    userName,
  }: FetchUserProfileParams) => {
    if (userName && !userId) {
      userId = await fetchUserIdByName({ userName });
    }
  
    const variables = { userID: userId };
    return fetchBase({
      variables,
      documentId: ENDPOINTS_DOCUMENT_ID.USER_PROFILE_THREADS,
    });
  };