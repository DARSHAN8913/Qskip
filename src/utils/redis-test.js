import { createClient } from "redis";

const client = createClient({
    url: "redis://localhost:6379/1"
});

await client.connect();

await client.set("test", "hello");

const value = await client.get("test");

console.log(value);

await client.quit();