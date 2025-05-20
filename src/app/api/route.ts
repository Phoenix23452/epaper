import { NextSuccess } from "@/lib/apiResponse";

export async function GET() {
  return NextSuccess("YOU ARE SUCCEDD FOR GETTING HELLO", {
    greetings: "Hello World",
  });
}
