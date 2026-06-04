import fs from "fs/promises";
import path from "path";

const bookingLua = await fs.readFile(
    path.resolve("src/utils/booking.lua"),
    "utf8"
);
 
export default bookingLua;