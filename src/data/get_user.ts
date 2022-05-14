import fs from "fs";
import path from "path";

import { ROLES, User } from "../types/types";

export const getUser = async (userId: number): Promise<User | null> => {
  return new Promise<User | null>(async (resolve, reject) => {
    try {
      const ids = fs
        .readFileSync(path.join(__dirname, "../../users.txt"), "utf-8")
        .split("\n")
        .map((strId) => parseFloat(strId));

      if (userId === 321438949) {
        resolve({
          roles: [ROLES.common, ROLES.virabotka],
        });
      } else if (ids.includes(userId)) {
        resolve({
          roles: [ROLES.common],
        });
      } else {
        resolve(null);
      }
    } catch (err) {
      reject(err);
    }
  });
};
