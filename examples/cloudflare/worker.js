import { errorInfo } from "../../analyze.js";

export default {
  async fetch() {
    return new Response(errorInfo);
  },
};
