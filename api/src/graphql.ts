import { makeExecutableSchema } from "@graphql-tools/schema";
import { merge } from "lodash";

import * as user from "./schema/user";

export const schema = makeExecutableSchema(
  merge({ typeDefs: [user.typeDefs], resolvers: [user.resolvers] })
);
