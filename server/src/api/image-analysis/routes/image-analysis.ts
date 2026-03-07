export default {
  routes: [
    {
      method: "POST",
      path: "/image-analysis", // what is this path? this is the path to the image analysis endpoint. e.g. http://localhost:1337/api/image-analysis
      //
      handler: "image-analysis.analyze", // what is this handler? this is the handler for the image analysis endpoint. e.g. http://localhost:1337/api/image-analysis
      config: {
        auth: false, // what is this auth? this is the authentication for the image analysis endpoint.
      },
    },
  ],
};
