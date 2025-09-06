// Run with: node test-socket.js
const { io } = require("socket.io-client");

// connect to your NestJS gateway
const socket = io("https://hotel-order-backend-1hli.onrender.com/", {
  transports: ["websocket"], // force websocket only
});

// when connected
socket.on("connect", () => {
  console.log("✅ Connected as client:", socket.id);

  // ---- TEST EVENTS ----

  // 1. Join a hotel
  socket.emit("joinTable", { hotelId: 1,tableId: "T1" });

  // 2. Post a new order
  socket.emit("createOrder", {
    hotelId: 1,
    total_amount: 100,
    payment_mode: "CASH",
    tableId: "T1",
    status: "PENDING",
    items: [
      { itemId: 1, qty: 2 },
      { itemId: 2, qty: 1 },
    ],
  });

  // 3. Add item to existing order (replace orderId with real one from DB)
  // setTimeout(() => {
  //   socket.emit("add_item", { orderId: 1, itemId: 10, qty: 3 });
  // }, 3000);

  // // 4. Send chat message
  // setTimeout(() => {
  //   socket.emit("send_message", { hotelId: "1", message: "Hello from test client!" });
  // }, 5000);

  // // 5. Close order (replace orderId with real one from DB)
  // setTimeout(() => {
  //   socket.emit("close_order", { orderId: 1 });
  // }, 8000);
});

// ---- LISTEN FOR RESPONSES ----
socket.on("joined", (data) => console.log("📌 Joined:", data));
socket.on("getDashboardOrders", (order) => console.log("🆕 Order created:", order));
socket.on("getTableData", (order) => console.log("📢 Hotel notified of new order:", order));

socket.on("error", (err) => console.error("❌ Error:", err));

// disconnect after 12s for demo
setTimeout(() => {
  console.log("🔌 Disconnecting...");
  socket.disconnect();
}, 12000);

