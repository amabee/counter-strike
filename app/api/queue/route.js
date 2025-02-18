import { readData, writeData } from "@/lib/queueData";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = readData();
    return Response.json(data);
  } catch (error) {
    console.error("Error in GET handler:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = readData();
    const { action, cashierId, name } = await request.json();

    if (action === "next") {
      data.currentTicket++;
      const cashier = data.cashiers.find((c) => c.id === cashierId);
      if (cashier) {
        cashier.currentNumber = data.currentTicket;
      }
    } else if (action === "addCashier") {
      const newId = Math.max(...data.cashiers.map((c) => c.id)) + 1;
      data.cashiers.push({
        id: newId,
        name,
        currentNumber: 0,
        isActive: true,
      });
    }

    writeData(data);
    return Response.json(data);
  } catch (error) {
    console.error("Error in POST handler:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
