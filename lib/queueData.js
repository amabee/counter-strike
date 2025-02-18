import fs from "fs";
import path from "path";
import { eventEmitter } from "./eventEmitter";

const dataPath = path.join(process.cwd(), "data", "queue.json");

export function readData() {
  try {
    if (!fs.existsSync(dataPath)) {
      const initialData = {
        currentTicket: 0,
        cashiers: [
          {
            id: 1,
            name: "Cashier 1",
            currentNumber: 0,
            isActive: true,
          },
        ],
      };
      fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    return JSON.parse(fs.readFileSync(dataPath, "utf8"));
  } catch (error) {
    console.error("Error reading queue data:", error);
    throw new Error("Failed to read queue data");
  }
}

export function writeData(data) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    eventEmitter.emit("update", data);
  } catch (error) {
    console.error("Error writing queue data:", error);
    throw new Error("Failed to write queue data");
  }
}
