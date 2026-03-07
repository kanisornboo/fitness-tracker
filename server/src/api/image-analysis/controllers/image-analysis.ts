import type { Context } from "koa";
import { analyzeImage } from "../services/gemini";

export default {
  async analyze(ctx: Context) {
    // ctx is the context of the request body and it contains the request body and the request files.
    const file = ctx.request.files?.image as unknown as { filepath: string };

    if (!file) {
      return ctx.badRequest("No image provided");
    }

    const filePath = file.filepath;

    try {
      const result = await analyzeImage(filePath);
      console.log({ result });
      return ctx.send({ success: true, result });
    } catch (error) {
      return ctx.internalServerError("Failed to analyze image");
    }
  },
};
