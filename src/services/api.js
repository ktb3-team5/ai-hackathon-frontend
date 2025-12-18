const API_BASE_URL = '/api';

export const api = {
  // 사용자 생성
  createUser: async () => {
    console.log('🚀 [API] Creating user...');
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      credentials: 'include',
    });
    console.log('✅ [API] User created:', response.status);
    if (!response.ok) throw new Error('Failed to create user');
    return response;
  },

  // 사용자 태그(선호도) 생성
  createUserTags: async (tags) => {
    console.log('🚀 [API] Creating user tags:', tags);
    const response = await fetch(`${API_BASE_URL}/users/me/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(tags),
    });
    console.log('✅ [API] User tags created:', response.status);
    if (!response.ok) throw new Error('Failed to create user tags');
    return response;
  },

  // 미디어 TOP 10 가져오기
  getTop10Media: async () => {
    console.log('🚀 [API] Fetching top 10 media...');
    const response = await fetch(`${API_BASE_URL}/media/top10`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch top 10 media');
    const data = await response.json();

    // snake_case를 camelCase로 변환
    const transformedData = data.map(item => ({
      id: item.id,
      title: item.title,
      type: item.type,
      posterUrl: item.poster_url || item.posterUrl, // snake_case와 camelCase 모두 지원
    }));

    console.log('✅ [API] Top 10 media received:', transformedData);
    return transformedData;
  },

  // 특정 미디어의 여행지 추천 TOP 3
  getTop3Destinations: async (mediaId) => {
    console.log('🚀 [API] Fetching top 3 destinations for mediaId:', mediaId);
    const response = await fetch(`${API_BASE_URL}/media/${mediaId}/destinations/top3`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch destinations');
    const data = await response.json();

    // snake_case를 camelCase로 변환
    const transformedData = data.map(item => ({
      name: item.name,
      address: item.address,
      description: item.description,
      imageUrl: item.image_url || item.imageUrl, // snake_case와 camelCase 모두 지원
    }));

    console.log('✅ [API] Top 3 destinations received:', transformedData);
    return transformedData;
  },
};
