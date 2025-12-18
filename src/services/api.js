const API_BASE_URL = '/api';

export const api = {
  // 사용자 생성
  createUser: async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response;
  },

  // 사용자 태그(선호도) 생성
  createUserTags: async (tags) => {
    const response = await fetch(`${API_BASE_URL}/users/me/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(tags),
    });
    if (!response.ok) throw new Error('Failed to create user tags');
    return response;
  },

  // 미디어 TOP 10 가져오기
  getTop10Media: async () => {
    const response = await fetch(`${API_BASE_URL}/media/top10`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch top 10 media');
    return response.json();
  },

  // 특정 미디어의 여행지 추천 TOP 3
  getTop3Destinations: async (mediaId) => {
    const response = await fetch(`${API_BASE_URL}/media/${mediaId}/destinations/top3`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch destinations');
    return response.json();
  },
};
