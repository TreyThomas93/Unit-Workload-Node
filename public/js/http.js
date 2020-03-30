class HTTP {
  async get(url) {
    const response = await fetch(url);

    const responseData = await response.json();

    const responseStatus = await response.status;

    return {
      responseData,
      responseStatus
    };
  }
}

export const http = new HTTP();
