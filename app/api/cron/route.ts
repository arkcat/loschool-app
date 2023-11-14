import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await fetch(
      "http://api.exchangerate.host/convert?from=USD&to=EUR"
    );
    const data = await result.json();

    if (data.success) {
      const rate = data.info.rate;
      console.log(`Latest exchange rate (USD to EUR): ${rate}`);
      return NextResponse.json(
        { message: `Exchange rate (USD to EUR) is ${rate}` },
        { status: 200 }
      );
    } else {
      console.error("Error fetching exchange rate:", data);
      return NextResponse.json(
        { error: "Failed to fetch exchange rate" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
  }
}
