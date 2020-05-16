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

  async post(url, data) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    });
    const resData = await response.json();
    return resData;
  }
}

export const http = new HTTP();
