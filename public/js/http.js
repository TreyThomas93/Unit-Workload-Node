class HTTP {
  async get(url) {
    const response = await fetch(url);

    const responseData = await response.json();

    return responseData;
  }
};

export const http = new HTTP();